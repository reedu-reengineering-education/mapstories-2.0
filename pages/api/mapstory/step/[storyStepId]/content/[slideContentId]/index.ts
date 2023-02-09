import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const slideContentId = req.query.slideContentId as string
      const storyStepId = req.query.storyStepId as string
      const deletedContent = await db.slideContent.delete({
        where: {
          id: slideContentId
        }
      })
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

export default withMethods(['DELETE'], withAuthentication(handler))
