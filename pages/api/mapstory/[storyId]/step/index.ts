import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { z } from 'zod'
import { StoryMode } from '@prisma/client'
import { reorderTimeline } from './timelineReorder'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const language = req.cookies.i18next ?? 'en'
      const titleText: any = {
        en: 'Your title',
        de: 'Deine Überschrift',
        es: 'Tu título',
        fr: 'Votre titre',
      }
      const storyId = req.query.storyId as string
      const stepContents = req.body.content as any[]

      const story = await db.story.findFirst({
        where: {
          id: storyId,
        },
        select: {
          steps: true,
          mode: true,
        },
      })
      const newStep = await db.storyStep.create({
        data: {
          storyId,
          viewport: {},
          position: story?.steps.length || 0,
          timestamp: req.body.timestamp ?? null,
          feature: req.body.feature ?? null,
          tags: req.body.tags ?? null,
        },
        include: {
          Story: {
            select: {
              name: true,
            },
          },
        },
      })
      if (story?.mode === StoryMode.TIMELINE) {
        await reorderTimeline(storyId)
      }
      // create default headline (TODO: translate placeholder text)
      // check if stepContents is undefined
      if (stepContents === undefined) {
        await db.slideContent.create({
          data: {
            type: 'TITLE',
            content: titleText[language],
            position: 0,
            storyStepId: newStep.id,
          },
        })
      } else {
        for (const slideContent of stepContents) {
          await db.slideContent.create({
            data: {
              type: slideContent.type,
              content: slideContent.content,
              position: slideContent.position,
              storyStepId: newStep.id,
            },
          })
        }
      }

      res.status(200).json(newStep)

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error)
        res.status(422).json(error.issues)
        return
      }

      res.status(422).end()
    }
  }
}

export default withMethods(['POST'], withAuthentication(withMapstory(handler)))
