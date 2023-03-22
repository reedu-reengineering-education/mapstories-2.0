import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import * as z from 'zod'

import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

export const schema = z.object({
  storyId: z.string(),
})

export function withMapstory(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const query = await schema.parse(req.query)

      // Check if the user has access to this mapstory.
      const session = await getServerSession(req, res, authOptions)
      const count = await db.story.count({
        where: {
          OR: [
            { id: req.query.storyId as string },
            { slug: req.query.storyId as string },
          ],
          ownerId: session?.user.id,
        },
      })

      if (count < 1) {
        return res.status(403).end()
      }

      return handler(req, res)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(500).end()
    }
  }
}
