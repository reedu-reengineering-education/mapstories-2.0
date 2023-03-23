import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'
import { MediaType } from '@prisma/client'
import parseOG from '@/src/lib/media/ogParser'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const storyStepId = req.query.storyStepId as string

      const { content: url } = req.body

      const ogData = (await parseOG({ url })) ?? {}

      const newSlideContent = await db.slideContent.create({
        data: {
          ...req.body,
          type: req.body.type as MediaType,
          storyStepId,
          ogData,
          position:
            (
              await db.storyStep.findFirst({
                where: {
                  id: storyStepId,
                },
                select: {
                  content: true,
                },
              })
            )?.content.length || 0,
        },
      })

      res.json(newSlideContent)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).json(error)
    }
  }
}

export default withMethods(['POST'], withAuthentication(handler))
