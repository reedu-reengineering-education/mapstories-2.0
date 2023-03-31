import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'
import parseOG from '@/src/lib/media/ogParser'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth'
import * as minio from 'minio';
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const slideContentId = req.query.slideContentId as string

      const { content: url } = req.body

      const ogData = (await parseOG({ url })) ?? {}

      const updatedContent = await db.slideContent.update({
        where: { id: slideContentId },
        data: { ...req.body, options: req.body.options ?? {}, ogData },
      })

      res.json(updatedContent)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).json(error)
    }
  }
  if (req.method === 'DELETE') {
    try {
      const slideContentId = req.query.slideContentId as string
      const storyStepId = req.query.storyStepId as string
      const deletedContent = await db.slideContent.delete({
        where: {
          id: slideContentId,
        },
      })

      if(deletedContent.type === 'IMAGE' || deletedContent.type === 'VIDEO'){
        const session = await getServerSession(req, res, authOptions);
        const userid = session?.user.id;
        const minioClient = new minio.Client({
          endPoint: process.env.S3_ENDPOINT!,
          port: parseInt(process.env.S3_PORT!),
          useSSL: false,
          accessKey: process.env.S3_ACCESS_KEY!,
          secretKey: process.env.S3_SECRET_KEY!,
        })
        const fileName = `${userid}/${deletedContent.content}`;
        minioClient.removeObject(process.env.S3_BUCKET_NAME!, fileName);
      }

      // Get all slide contents for the given story step id
      const slideContents = await db.slideContent.findMany({
        where: {
          storyStepId,
        },
      })

      // Update the position of each slide content
      await db.$transaction(
        slideContents
          .sort((a, b) => a.position - b.position)
          .map((content, index) => {
            return db.slideContent.update({
              where: {
                id: content.id,
              },
              data: {
                position: index,
              },
            })
          }),
      )

      res.json(deletedContent)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(['PUT', 'DELETE'], withAuthentication(handler))
