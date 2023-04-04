import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'
import parseOG from '@/src/lib/media/ogParser'

async function handler(req: NextApiRequest, res: NextApiResponse) {

      if (req.method === 'PUT') {
    try {
      const mediaId = req.query.mediaId as string

      const { content: url } = req.body

      const ogData = (await parseOG({ url })) ?? {}

      const updatedContent = await db.image.update({
        where: { id: mediaId },
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
      const mediaId = req.query.mediaId as string
      const deletedMedia = await db.image.delete({
        where: { id: mediaId },
      })

      res.json(deletedMedia)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).json(error)
    }
  }
}

export default withMethods(['GET','PUT', 'DELETE'], withAuthentication(handler))
