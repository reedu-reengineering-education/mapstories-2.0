// everything used to alter images

import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { authOptions } from '@/src/lib/auth'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import * as minio from 'minio'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let media
    const session = await getServerSession(req, res, authOptions)
    const userid = session?.user.id

    if (req.method === 'DELETE') {
      const fileName = req.query.mediaId + '.' + req.query.fileName
      media = await db.media.delete({
        where: { id: req.query.mediaId as string },
      })
      const minioClient = new minio.Client({
        endPoint: process.env.S3_ENDPOINT!,
        port: parseInt(process.env.S3_PORT!),
        useSSL: process.env.S3_USE_SSL === 'true'!,
        accessKey: process.env.S3_ACCESS_KEY!,
        secretKey: process.env.S3_SECRET_KEY!,
      })
      minioClient.removeObject(
        process.env.S3_BUCKET_NAME!,
        `${fileName}`,
        err => {
          if (err) {
            console.log(err)
          }
        },
      )
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
