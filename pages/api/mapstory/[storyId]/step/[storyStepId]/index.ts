import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { z } from 'zod'
import { updateStepSchema } from '@/src/lib/validations/step'

import { tryFeature } from 'pure-geojson-validation'
import { Feature } from 'geojson'

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      return res.end()
    } catch (error) {
      return res.status(500).end()
    }
  }
  if (req.method === 'PUT') {
    try {
      const { feature, timestamp, tags } = updateStepSchema.parse(req.body)

      let validFeature: Feature | null = null
      if (feature) {
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

      res.status(200).json(storyStep)
      return res.end()
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error?.toString() })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const storyStepId = req.query.storyStepId as string

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
        return res.status(422).end()
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

      res.json(deletedStep)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(
  ['GET', 'PUT', 'DELETE'],
  withAuthentication(withMapstory(handler)),
)
