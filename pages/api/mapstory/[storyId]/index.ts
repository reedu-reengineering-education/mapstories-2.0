import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const story = await db.story.findFirst({
        where: {
          id: req.query.storyId as string,
        },
        include: {
          steps: {
            include: {
              content: true,
            },
          },
        },
      })

      return res.status(200).json(story)
    } catch (error) {
      return res.status(500).end()
    }
  }
  if (req.method === 'PUT') {
    try {
      const story = await db.story.update({
        where: {
          id: req.query.storyId as string,
        },
        data: {
          name: req.body.name as string,
          description: req.body.description as string,
          visibility: req.body.visibility === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE',
          theme: req.body.theme as string,
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

export default withMethods(['GET', 'DELETE', 'PUT'], withMapstory(handler))
