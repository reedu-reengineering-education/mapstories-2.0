import { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'
import { unstable_getServerSession } from 'next-auth/next'

import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { withMethods } from '@/lib/apiMiddlewares/withMethods'
import { createMapstoryeSchema } from '@/lib/validations/mapstory'
import { withAuthentication } from '@/lib/apiMiddlewares/withAuthentication'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const session = await unstable_getServerSession(req, res, authOptions)
      const user = session?.user

      const body = req.body

      if (body?.name && user) {
        const payload = createMapstoryeSchema.parse(body)

        const newMapstory = await db.story.create({
          data: {
            ownerId: user.id,
            name: payload.name,
            visibility: 'PRIVATE',
          },
        })

        await db.storyStep.create({
          data: {
            storyId: newMapstory.id,
            viewport: {},
          },
        })

        res.json(newMapstory)
      }

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(['POST'], withAuthentication(handler))
