// everything used to alter images

import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { authOptions } from '@/src/lib/auth'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { deleteObject } from '@/src/lib/s3'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let media
    await getServerSession(req, res, authOptions)

    if (req.method === 'DELETE') {
      const fileName = req.query.mediaId + '.' + req.query.fileName
      media = await db.media.delete({
        where: { id: req.query.mediaId as string },
      })
      try {
        await deleteObject(fileName)
      } catch (err) {
        console.error(err)
      }
    }

    res.json(media)
    res.end()
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(422).json(error.issues)
    }

    res.status(422).json(error.message)
  }
}

export default withMethods(['DELETE'], withAuthentication(handler))
