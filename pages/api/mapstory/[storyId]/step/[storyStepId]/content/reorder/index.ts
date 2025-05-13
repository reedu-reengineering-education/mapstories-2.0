import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { SlideContent } from '@prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const step = await db.storyStep.findFirst({
        where: {
          id: req.query.storyStepId as string,
        },
        include: {
          content: true,
        },
      })

      // room ids from the request
      const contentIds = (req.body as SlideContent[]).map(r => r.id)

      const newContentOrder = contentIds.map((s, i) => ({
        ...step?.content.find(c => c.id === s),
        position: i,
      }))

      await db.$transaction(
        newContentOrder.map(s =>
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

      const stepToReturn = await db.storyStep.findFirst({
        where: {
          id: step?.id,
        },
        include: {
          content: true,
        },
      })

      res.status(200).json(stepToReturn)
    } catch (error) {
      res.status(500).end()
    }
  }
}

export default withMethods(['PUT'], handler)
