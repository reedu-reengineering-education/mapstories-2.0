import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const mediaTable = await db.media.findFirst({
        where: {
          id: req.query.mediaId as string,
        },
      })
      res.status(200).json(mediaTable)
      return res.end()
    }
    if (req.method === 'PUT') {
      const updatedImage = await db.media.update({
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

export default withMethods(['GET', 'PUT'], handler)
