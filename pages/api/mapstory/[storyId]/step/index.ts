import { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'

import { db } from '@/lib/db'
import { withMethods } from '@/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/lib/apiMiddlewares/withAuthentication'
import { withMapstory } from '@/lib/apiMiddlewares/withMapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const storyId = req.query.storyId as string

      const newStep = await db.storyStep.create({
        data: {
          storyId,
          viewport: {},
          position:
            (
              await db.story.findFirst({
                where: {
                  id: storyId,
                },
                select: {
                  steps: true,
                },
              })
            )?.steps.length || 0,
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
