import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { z } from 'zod'
import { MediaType } from '@prisma/client'
import parseOG from '@/src/lib/media/ogParser'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const stepSuggestionId = req.query.stepSuggestionId as string

      const { content: url } = req.body

      const ogData = (await parseOG({ url })) ?? {}
      const newSlideContent = await db.slideContent.create({
        data: {
          ...req.body,
          type: req.body.type as MediaType,
          suggestionId: stepSuggestionId,
          ogData,
          position:
            (
              await db.storyStepSuggestion.findFirst({
                where: {
                  id: stepSuggestionId,
                },
                select: {
                  content: true,
                },
              })
            )?.content.length || 0,
        },
      })

      res.status(200).json(newSlideContent)

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      res.status(422).json(error)
    }
  }
}

export default withMethods(['POST'], withMapstory(handler))
