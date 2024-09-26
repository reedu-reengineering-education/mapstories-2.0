import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/src/lib/auth'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const session = await getServerSession(req, res, authOptions)
      const params = req.query

      if (!session?.user) {
        throw new Error('Unauthenticated')
      }

      const user = await db.user.findFirst({
        where: {
          id: session.user.id,
        },
      })
      if (!user || user.verify_new_email_token != params.token) {
        return res.status(422).json({ error: 'Invalid Token or User' })
      }

      const updatedUser = await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          email: user.new_email,
          new_email: null,
          verify_new_email_token: null,
        },
      })

      return res.status(200).json(updatedUser)
    } catch (error) {
      return res.status(422).json(error)
    }
  }
}

export default withMethods(['GET'], handler)
