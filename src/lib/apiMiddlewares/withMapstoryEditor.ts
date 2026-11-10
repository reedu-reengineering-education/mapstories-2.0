import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import * as z from 'zod'

import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { storyEditorWhere } from '@/src/lib/story/storyAccess'

export const schema = z.object({
  storyId: z.string(),
})

// Like withMapstory, but also grants access to contributors of the story.
export function withMapstoryEditor(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const query = schema.parse(req.query)

      const session = await getServerSession(req, res, authOptions)
      if (!session?.user.id) {
        return res.status(403).end()
      }

      const count = await db.story.count({
        where: {
          AND: [
            { OR: [{ id: query.storyId }, { slug: query.storyId }] },
            storyEditorWhere(session.user.id),
          ],
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
