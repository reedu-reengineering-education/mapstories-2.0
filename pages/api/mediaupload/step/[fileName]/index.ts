import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'
import * as minio from 'minio'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'

async function generatePresignedUrl(
  method: string,
  fileName: string,
  minioClient: minio.Client,
  bucketName: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    minioClient.presignedUrl(method, bucketName, fileName, (err, url) => {
      if (err) {
        reject(err)
      }
      resolve(url)
    })
  })
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)
    const userid = session?.user.id
    // uploads image to minio via minio client
    const minioClient = new minio.Client({
      endPoint: process.env.S3_ENDPOINT!,
      port: parseInt(process.env.S3_PORT!),
      useSSL: false,
      accessKey: process.env.S3_ACCESS_KEY!,
      secretKey: process.env.S3_SECRET_KEY!,
    })

    const fileName = `${userid}/${req.query.fileName}`

    const method = req.method as string

    minioClient.presignedUrl(
      method,
      process.env.S3_BUCKET_NAME!,
      fileName,
      (err, url) => {
        return res.status(200).json(url)
      },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues)
    }
    return res.status(422).json(error)
  }
}

export default withMethods(
  ['GET', 'POST', 'PUT', 'DELETE'],
  withAuthentication(handler),
)
