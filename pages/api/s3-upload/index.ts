import { APIRoute } from 'next-s3-upload';


export default APIRoute.configure({
    accessKeyId: process.env.MINIO_ACCESS_KEY_ID,
    secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY,
    bucket: process.env.MINIO_BUCKET,
    region: 'us-east-1',
    endpoint: process.env.MINIO_ENDPOINT,
    forcePathStyle: true
  });