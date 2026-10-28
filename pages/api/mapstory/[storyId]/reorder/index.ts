import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { withMapstoryEditor } from '@/src/lib/apiMiddlewares/withMapstoryEditor'
import { translationReadonly } from '@/src/lib/story/storyAccess'
import { syncStepPositions } from '@/src/lib/story/syncTranslations'
import { StoryStep } from '@prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const story = await db.story.findFirst({
        where: {
          id: req.query.storyId as string,
        },
        include: {
          steps: true,
        },
      })
      if (story?.isTranslation) {
        return translationReadonly(res)
      }

      // room ids from the request
      const stepIds = (req.body as StoryStep[]).map(r => r.id)

      const newStepOrder = stepIds.map((s, i) => ({
        ...story?.steps.find(step => step.id === s),
        position: i,
      }))

      await db.$transaction(
        newStepOrder.map(s =>
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

      if (story) {
        await syncStepPositions(story.id)
      }

      const storyToReturn = await db.story.findFirst({
        where: {
          id: story?.id,
        },
        include: {
          steps: {
            include: {
              content: true,
            },
          },
        },
      })

      res.status(200).json(storyToReturn)
    } catch (error) {
      res.status(500).end()
    }
  }
}

export default withMethods(['PUT'], withMapstoryEditor(handler))
