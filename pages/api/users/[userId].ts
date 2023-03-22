import { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'
import { getServerSession } from 'next-auth/next'

import { db } from '@/src/lib/db'
import { userUpdateSchema } from '@/src/lib/validations/user'
import { authOptions } from '@/src/lib/auth'
import { withCurrentUser } from '@/src/lib/apiMiddlewares/withCurrentUser'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      const body = req.body

      if (!user) {
        throw new Error('Unauthenticated')
      }
      const payload = userUpdateSchema.parse(body)

      const updatedUser = await db.user.update({
        where: {
          id: user.id,
        },
        data: payload,
      })

      return res.status(200).json(updatedUser)
    } catch (error) {
      return res.status(422).json(error)
    }
  }
  if (req.method === 'DELETE') {
    try {
      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      if (user) {
        await db.user.delete({
          where: {
            id: user.id,
          },
        })
      }

      return res.status(200).end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(['PATCH', 'DELETE'], withCurrentUser(handler))
