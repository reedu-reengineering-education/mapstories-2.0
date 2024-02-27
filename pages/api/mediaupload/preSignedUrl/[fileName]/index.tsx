import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { z } from 'zod'
import * as minio from 'minio'

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
    // uploads image to minio via minio client
    const minioClient = new minio.Client({
      endPoint: process.env.S3_ENDPOINT!,
      port: parseInt(process.env.S3_PORT!),
      useSSL: process.env.S3_USE_SSL! === 'true'!,
      accessKey: process.env.S3_ACCESS_KEY!,
      secretKey: process.env.S3_SECRET_KEY!,
    })

    const fileName = `${req.query.fileName}`

    const method = req.method as string
    const url = await generatePresignedUrl(
      method,
      fileName,
      minioClient,
      process.env.S3_BUCKET_NAME!,
    )
    res.status(200).json(url)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json(error.issues)
    }
    res.status(422).json(error)
  }
}

export default withMethods(['GET', 'POST', 'PUT', 'DELETE'], handler)
