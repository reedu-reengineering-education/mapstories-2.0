import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'
import { SlideContent } from '@prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const storyStep = await db.storyStep.findFirst({
        where: {
          id: req.query.storyStepId as string,
        },
        include: {
          content: true,
        },
      })

      // room ids from the request
      const contentIds = (req.body as SlideContent[]).map(r => r.id)

      const newSlideContentOrder = contentIds.map((s, i) => ({
        ...storyStep?.content.find(c => c.id === s),
        position: i,
      }))

      await db.$transaction(
        newSlideContentOrder.map(s =>
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

      const storyStepToReturn = await db.storyStep.findFirst({
        where: {
          id: storyStep?.id,
        },
        include: {
          content: true,
        },
      })

      return res.status(200).json(storyStepToReturn)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
  if (req.method === 'DELETE') {
    try {
      const slideContentId = req.query.slideContentId as string
      const storyStepId = req.query.storyStepId as string
      const deletedContent = await db.slideContent.delete({
        where: {
          id: slideContentId,
        },
      })
      res.json(deletedContent)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(['DELETE'], withAuthentication(handler))
