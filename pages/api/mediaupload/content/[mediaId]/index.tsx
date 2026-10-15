import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'
import { syncMediaUpdated } from '@/src/lib/story/syncTranslations'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const mediaTable = await db.media.findFirst({
        where: {
          id: req.query.mediaId as string,
        },
      })
      res.status(200).json(mediaTable)
      res.end()
    }
    if (req.method === 'PUT') {
      const { id: _id, ...data } = req.body
      const updatedImage = await db.media.update({
        where: {
          id: req.query.mediaId as string,
        },
        data,
      })
      await syncMediaUpdated(updatedImage.id, data)
      res.status(200).json(updatedImage)
      res.end()
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export default withMethods(['GET', 'PUT'], handler)
