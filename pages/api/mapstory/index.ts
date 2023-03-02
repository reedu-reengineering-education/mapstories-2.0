import { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'
import { unstable_getServerSession } from 'next-auth/next'

import { db } from '@/src/lib/db'
import { authOptions } from '@/src/lib/auth'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { createMapstorySchema } from '@/src/lib/validations/mapstory'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { generateSlug } from '@/src/lib/slug'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      const user = session?.user

      const body = req.body

      if (body?.name && user) {
        const payload = createMapstorySchema.parse(body)

        const slug = await generateSlug(payload.name)
        const newMapstory = await db.story.create({
          data: {
            ownerId: user.id,
            name: payload.name,
            visibility: 'PRIVATE',
            slug,
          },
        })

        await db.storyStep.create({
          data: {
            storyId: newMapstory.id,
            viewport: {},
            position: 0,
          },
        })

        res.json(newMapstory)
      }

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
