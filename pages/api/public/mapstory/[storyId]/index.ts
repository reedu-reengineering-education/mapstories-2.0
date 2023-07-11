import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storyId = req.query.storyId as string

  if (req.method === 'GET') {
    try {
      const story = await db.story.findFirst({
        where: {
          visibility: 'PUBLIC',
          OR: [{ id: storyId }, { slug: storyId }],
        },
        include: {
          firstStep: {
            include: {
              content: true,
            },
          },
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
}

export default withMethods(['GET', 'DELETE', 'PUT'], handler)
