import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'
import * as minio from 'minio'

async function generatePresignedUrl(
  method: string,
  fileName: string,
  minioClient: minio.Client,
  bucketName: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(minioClient)
    minioClient.presignedUrl(method, bucketName, fileName, (err, url) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      resolve(url)
    })
  })
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('req.query', req.query)
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
    console.log(
      process.env.S3_BUCKET_NAME!,
      process.env.S3_PORT!,
      process.env.S3_USE_SSL!,
      process.env.S3_ACCESS_KEY!,
      process.env.S3_SECRET_KEY!,
    )
    const url = await generatePresignedUrl(
      method,
      fileName,
      minioClient,
      process.env.S3_BUCKET_NAME!,
    )
    return res.status(200).json(url)
  } catch (error: any) {
    console.log(error)

    console.log(error.code, error.message)
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
