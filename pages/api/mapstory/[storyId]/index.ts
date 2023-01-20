import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/lib/apiMiddlewares/withMethods'
import { db } from '@/lib/db'
import { withMapstory } from '@/lib/apiMiddlewares/withMapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const story = await db.story.findFirst({
        where: {
          id: req.query.storyId as string,
        },
        include: {
          steps: true,
        },
      })

      return res.status(200).json(story)
    } catch (error) {
      return res.status(500).end()
    }
  }
  if (req.method === 'DELETE') {
    try {
      await db.story.delete({
        where: {
          id: req.query.storyId as string,
        },
      })

      return res.status(204).end()
    } catch (error) {
      return res.status(500).end()
    }
  }
}

export default withMethods(['GET', 'DELETE'], withMapstory(handler))