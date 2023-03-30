import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'
import * as minio from 'minio'
async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
    // uploads image to minio via minio client 
    const minioClient = new minio.Client({
        endPoint: process.env.S3_ENDPOINT!,
        port: parseInt(process.env.S3_PORT!),
        useSSL: false,
        accessKey: process.env.S3_ACCESS_KEY!,
        secretKey: process.env.S3_SECRET_KEY!
    })

    const fileName = req.query.fileName as string
    const method = req.method as string

    minioClient.presignedUrl(method,'mapstories20', fileName, (err, url)=>{
        if(err){ return console.log(err)}
        res.json(url);
      })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json(error.issues)
        }
        return res.status(422).json(error)
    }
    
}

export default withMethods(['GET','POST', 'PUT', 'DELETE'], withAuthentication(handler))
