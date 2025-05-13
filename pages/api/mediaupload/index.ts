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
      const mediaTable = await db.media.findFirst({
        where: {
          id: req.query.mediaId as string,
        },
      })
      res.status(200).json(mediaTable)
      res.end
    }
  } catch (error) {
    res.status(500).end()
  }
}

export default withMethods(['GET'], withAuthentication(handler))
