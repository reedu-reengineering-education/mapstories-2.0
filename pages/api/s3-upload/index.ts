import { APIRoute } from 'next-s3-upload';


export default APIRoute.configure({
    accessKeyId: 'xwlBuKvxlaLZjRUu',
    secretAccessKey: 'vSXh3wffqOm9LFABe51eobnSpqUHrHy6',
    bucket: 'mapstories20',
    region: 'us-east-1',
    endpoint: 'http://localhost:9000',
    forcePathStyle: true
  });