import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { updateMapstorySchema } from '@/src/lib/validations/mapstory'
import { generateSlug } from '@/src/lib/slug'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storyId = req.query.storyId as string

  if (req.method === 'GET') {
    try {
      const story = await db.story.findFirst({
        where: {
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

      res.status(200).json(story)
    } catch (error) {
      res.status(500).end()
    }
  }
  if (req.method === 'PUT') {
    try {
      const payload = updateMapstorySchema.parse(req.body)

      const storyToUpdate = await db.story.findFirst({
        where: {
          id: storyId,
        },
        select: {
          name: true,
        },
      })

      if (!storyToUpdate) {
        res.status(404).end();
        return;
      }

      let data: any = payload

      const nameChanged = payload.name !== storyToUpdate.name
      if (nameChanged) {
        const slug = await generateSlug(payload.name)
        data = {
          ...data,
          slug,
        }
      }

      const story = await db.story.update({
        where: {
          id: storyId,
        },
        data,
      })

      res.status(200).send({story})
    } catch (error) {
      res.status(500).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.story.delete({
        where: {
          id: storyId,
        },
      })

      res.status(200).end()
    } catch (error) {
      res.status(500).end()
    }
  }
}

export default withMethods(['GET', 'DELETE', 'PUT'], withMapstory(handler))
