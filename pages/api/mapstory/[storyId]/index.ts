import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { updateMapstorySchema } from '@/src/lib/validations/mapstory'
import { generateSlug } from '@/src/lib/slug'
import { withMapstoryEditor } from '@/src/lib/apiMiddlewares/withMapstoryEditor'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth/next'
import { syncStorySettings } from '@/src/lib/story/syncTranslations'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storyId = req.query.storyId as string
  const session = await getServerSession(req, res, authOptions)

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
          ownerId: true,
          isTranslation: true,
        },
      })

      if (!storyToUpdate) {
        res.status(404).end()
        return
      }

      let data: any = payload
      if (storyToUpdate.ownerId !== session?.user.id) {
        // contributors may only change the texts of the story
        data = {
          name: payload.name,
          description: payload.description,
          author: payload.author,
        }
      } else if (storyToUpdate.isTranslation) {
        // mode, lines and theme are taken over from the original story
        const { mode: _mode, lines: _lines, themeId: _themeId, ...rest } = payload
        data = rest
      }

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

      if (!story.isTranslation && storyToUpdate.ownerId === session?.user.id) {
        await syncStorySettings(story.id, {
          mode: payload.mode,
          lines: payload.lines,
          themeId: payload.themeId,
        })
      }

      res.status(200).json(story)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      const owned = await db.story.count({
        where: { id: storyId, ownerId: session?.user.id },
      })
      if (owned < 1) {
        return res.status(403).end()
      }

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

export default withMethods(['GET', 'DELETE', 'PUT'], withMapstoryEditor(handler))
