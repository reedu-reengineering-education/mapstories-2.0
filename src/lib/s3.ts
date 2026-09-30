import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const PRESIGNED_URL_EXPIRY_SECONDS = 60 * 60

const endpoint = process.env.S3_ENDPOINT!

// prevent local development from writing into the production object storage
if (
  process.env.NODE_ENV !== 'production' &&
  endpoint?.includes('your-objectstorage.com') &&
  process.env.S3_ALLOW_REMOTE_IN_DEV !== 'true'
) {
  throw new Error(
    `S3_ENDPOINT points to Hetzner object storage (${endpoint}) while not in production. ` +
      'Use the local MinIO container (http://localhost:9000) or set S3_ALLOW_REMOTE_IN_DEV=true.',
  )
}

const bucket = process.env.S3_BUCKET_NAME!

const s3Client = new S3Client({
  endpoint,
  region: process.env.S3_REGION ?? 'us-east-1',
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

export function getPresignedUrl(method: 'GET' | 'PUT', key: string) {
  const command =
    method === 'PUT'
      ? new PutObjectCommand({ Bucket: bucket, Key: key })
      : new GetObjectCommand({ Bucket: bucket, Key: key })

  return getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
  })
}

export async function deleteObject(key: string) {
  await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}
