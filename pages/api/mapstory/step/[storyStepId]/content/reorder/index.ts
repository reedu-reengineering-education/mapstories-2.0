import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { SlideContent } from '@prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      //TODO: Check schema
      const step = await db.storyStep.findFirst({
        where: {
          id: req.query.storyStepId as string,
        },
        include: {
          content: true,
        },
      })

      console.log(req.query.storyStepId)
      console.log(step)

      const contentIds = (req.body as SlideContent[]).map(r => r.id)

      const newSlideContentOrder = contentIds.map((s, i) => ({
        ...step?.content.find(c => c.id === s),
        position: i,
      }))

      await db.$transaction(
        newSlideContentOrder.map(s =>
          db.slideContent.update({
            where: {
              id: s.id,
            },
            data: {
              position: s.position,
            },
          }),
        ),
      )

      const stepToReturn = await db.story.findFirst({
        where: {
          id: step?.id,
        },
      })

      return res.status(200).json(stepToReturn)
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}

export default withMethods(['PUT'], handler)
