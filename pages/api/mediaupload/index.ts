import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const session = await getServerSession(req, res, authOptions)
      // get the image from the prisma table using the media id which is provided in the body
      const imageTable = await db.image.findFirst({
        where: {
          id: req.query.mediaId as string,
        },
      })
      res.status(200).json(imageTable)
      return res.end
    }
  } catch (error) {
    return res.status(500).end()
  }
}

export default withMethods(['GET'], withAuthentication(handler))
