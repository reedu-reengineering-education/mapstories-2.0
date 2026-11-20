import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstoryEditor } from '@/src/lib/apiMiddlewares/withMapstoryEditor'
import {
  findStory,
  stepBelongsToStory,
  translationReadonly,
} from '@/src/lib/story/storyAccess'
import {
  syncStepDeleted,
  syncStepPositions,
  syncStepUpdated,
} from '@/src/lib/story/syncTranslations'
import { z } from 'zod'
import { updateStepSchema } from '@/src/lib/validations/step'

import { tryFeature } from 'pure-geojson-validation'
import { Feature } from 'geojson'
import { StoryMode } from '@prisma/client'
import { reorderTimeline } from '../timelineReorder'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    // Mutations must target a step of the story in the URL, otherwise the
    // translation guard below could be bypassed via another story's id.
    const urlStory = await findStory(req.query.storyId as string)
    if (
      !urlStory ||
      !(await stepBelongsToStory(req.query.storyStepId as string, urlStory))
    ) {
      return res.status(404).end()
    }
    if (urlStory.isTranslation) {
      return translationReadonly(res)
    }
  }

  if (req.method === 'GET') {
    try {
      const storyStep = await db.storyStep.findFirst({
        where: {
          id: req.query.storyStepId as string,
        },
        include: {
          content: true,
        },
      })
      res.status(200).json(storyStep)
      res.end()
    } catch (error) {
      res.status(500).end()
    }
  }
  if (req.method === 'PUT') {
    try {
      const { feature, timestamp, tags } = updateStepSchema.parse(req.body)

      // the title slide never gets a marker
      const isTitleStep =
        (await db.story.count({
          where: { firstStepId: req.query.storyStepId as string },
        })) > 0

      let validFeature: Feature | null = null
      if (feature && !isTitleStep) {
        // throw new Error('No Feature was included in the request body')
        validFeature = tryFeature(feature)

        // check if feature has the correct featureType
        if (
          validFeature &&
          !['Point', 'LineString', 'Polygon'].some(
            e => e === validFeature?.geometry.type,
          )
        ) {
          throw new Error('Feature must be Point, LineString or Polygon')
        }
      }

      const storyStep = await db.storyStep.update({
        where: {
          id: req.query.storyStepId as string,
        },
        data: {
          feature: (validFeature as any) ?? undefined, // any fix for Prisma Json field
          timestamp,
          tags,
        },
        include: {
          content: true,
        },
      })

      const storyId = storyStep.storyId

      if (!storyId) {
        res.status(422).end()
        return
      }

      const story = await db.story.findFirst({
        where: {
          id: storyId,
        },
      })

      if (story?.mode === StoryMode.TIMELINE) {
        await reorderTimeline(storyId)
      }

      await syncStepUpdated(storyStep.id, {
        feature: (validFeature as any) ?? undefined,
        timestamp,
        tags,
      })
      if (story?.mode === StoryMode.TIMELINE) {
        await syncStepPositions(storyId)
      }

      res.status(200).json(storyStep)
      res.end()
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error?.toString() })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const storyStepId = req.query.storyStepId as string

      await syncStepDeleted(storyStepId)

      // TODO: Check if we really need to delete slide Content: oncascade delete story step
      // delete all slideContent associated with the step
      const deletedContent = await db.slideContent.deleteMany({
        where: { storyStepId: storyStepId },
      })
      // delete the step
      const deletedStep = await db.storyStep.delete({
        where: { id: storyStepId },
      })

      //TODO: THis can never happen but we need this code for TS?
      if (!deletedStep.storyId) {
        res.status(422).end()
        return
      }

      const updatedStory = await db.story.findFirst({
        where: {
          id: deletedStep.storyId.toString(),
        },
        include: {
          steps: true,
        },
      })

      // update step positions after removing one
      const newStepOrder = updatedStory?.steps
        .sort((a, b) => a.position - b.position)
        .map((s, i) => ({
          ...updatedStory?.steps.find(step => step.id === s.id),
          position: i,
        }))

      await db.$transaction(
        newStepOrder!.map(s =>
          db.storyStep.update({
            where: {
              id: s.id,
            },
            data: {
              position: s.position,
            },
          }),
        ),
      )

      await syncStepPositions(deletedStep.storyId)

      res.json(deletedStep)

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(422).json(error.issues)
      }

      res.status(422).end()
    }
  }
}

export default withMethods(
  ['GET', 'PUT', 'DELETE'],
  withAuthentication(withMapstoryEditor(handler)),
)
