import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { z } from 'zod'
import parseOG from '@/src/lib/media/ogParser'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const slideContentId = req.query.slideContentId as string

      const { content: url } = req.body

      const ogData = (await parseOG({ url })) ?? {}

      const updatedContent = await db.slideContent.update({
        where: { id: slideContentId },
        data: { ...req.body, options: req.body.options ?? {}, ogData },
      })

      res.status(200).json(updatedContent)

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(422).json(error.issues)
      }

      res.status(422).json(error)
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
      })

      // Update the position of each slide content
      await db.$transaction(
        slideContents
          .sort((a, b) => a.position - b.position)
          .map((content, index) => {
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

      res.status(200).json(deletedContent)

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(422).json(error.issues)
      }

      res.status(422).end()
    }
  }
}

export default withMethods(['PUT', 'DELETE'], withMapstory(handler))
