import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const slideContentId = req.query.slideContentId as string

      const updatedContent = await db.slideContent.update({
        where: { id: slideContentId },
        data: { ...req.body, options: req.body.options ?? {} },
      })

      res.json(updatedContent)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).json(error)
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

      // Get all slide contents for the given story step id
      const slideContents = await db.slideContent.findMany({
        where: {
          storyStepId,
        },
        orderBy: {
          position: 'asc',
        },
      })

      // Update the position of each slide content
      await db.$transaction(
        slideContents.map((content, index) => {
          return db.slideContent.update({
            where: {
              id: content.id,
            },
            data: {
              position: index,
            },
          })
        }),
      )

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

export default withMethods(['PUT', 'DELETE'], withAuthentication(handler))
