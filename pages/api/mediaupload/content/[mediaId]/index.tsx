import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const imageTable = await db.image.findFirst({
        where: {
          id: req.query.mediaId as string,
        },
      })
      res.status(200).json(imageTable)
      return res.end()
    }
    if (req.method === 'PUT') {
      const updatedImage = await db.image.update({
        where: {
          id: req.query.mediaId as string,
        },
        data: {
          ...req.body,
        },
      })
      res.status(200).json(updatedImage)
      return res.end()
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export default withMethods(['GET', 'PUT'], withAuthentication(handler))