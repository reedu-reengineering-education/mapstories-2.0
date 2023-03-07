import { APIRoute } from 'next-s3-upload';


export default APIRoute.configure({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
    region: 'us-east-1',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true
  });