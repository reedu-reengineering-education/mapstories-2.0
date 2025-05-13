import { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'
import { getServerSession } from 'next-auth/next'

import { db } from '@/src/lib/db'
import { authOptions } from '@/src/lib/auth'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { createMapstorySchema } from '@/src/lib/validations/mapstory'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { generateSlug } from '@/src/lib/slug'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      const body = req.body

      if (body?.name && user) {
        const payload = createMapstorySchema.parse(body)

        const slug = await generateSlug(payload.name)
        const newMapstory = await db.story.create({
          data: {
            ownerId: user.id,
            visibility: 'PRIVATE',
            slug,
            ...payload,
          },
        })

        const firstStep = await db.storyStep.create({
          data: {
            viewport: {},
            position: 0,
          },
        })

        // create default headline (disabled for titleslide for now)
        // await db.slideContent.create({
        //   data: {
        //     type: 'TITLE',
        //     content: payload.name,
        //     position: 0,
        //     storyStepId: firstStep.id,
        //   },
        // })

        await db.story.update({
          where: { id: newMapstory.id },
          data: { firstStepId: firstStep.id },
        })

        res.status(200).json(newMapstory)
      }

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(422).json(error.issues)
      }

      res.status(422).json(error)
    }
  }
}

export default withMethods(['POST'], withAuthentication(handler))
