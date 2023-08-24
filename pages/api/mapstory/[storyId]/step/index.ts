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
      const storyId = req.query.storyId as string

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
      await db.slideContent.create({
        data: {
          type: 'TITLE',
          content: 'Deine Überschrift',
          position: 0,
          storyStepId: newStep.id,
        },
      })

      res.json(newStep)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(['POST'], withAuthentication(withMapstory(handler)))
