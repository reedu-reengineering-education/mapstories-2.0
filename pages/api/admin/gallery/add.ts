import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

type Data =
  | {
      success: true
      galleryStory: any
    }
  | { error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  })

  if (user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' })
  }

  if (req.method === 'POST') {
    try {
      const { storyId } = req.body

      if (!storyId) {
        return res.status(400).json({ error: 'storyId is required' })
      }

      // Verify story exists and is PUBLIC
      const story = await db.story.findUnique({
        where: { id: storyId },
        include: { group: true },
      })

      if (!story) {
        return res.status(404).json({ error: 'Story not found' })
      }

      if (story.visibility !== 'PUBLIC') {
        return res.status(400).json({ error: 'Story must be PUBLIC to add to gallery' })
      }

      // Check if already in gallery
      const existing = await db.galleryStory.findUnique({
        where: { storyId },
      })

      if (existing) {
        return res.status(400).json({ error: 'Story already in gallery' })
      }

      // Get max position
      const maxPosition = await db.galleryStory.aggregate({
        _max: { position: true },
      })

      const newPosition = (maxPosition._max.position ?? -1) + 1

      // Add all stories in the group to gallery (if grouped)
      // But only create one GalleryStory entry pointing to the first/main story
      const galleryStory = await db.galleryStory.create({
        data: {
          storyId,
          addedBy: user.id,
          position: newPosition,
        },
        include: {
          story: {
            include: {
              group: {
                include: {
                  stories: true,
                },
              },
            },
          },
        },
      })

      return res.status(201).json({
        success: true,
        galleryStory,
      })
    } catch (error) {
      console.error('Error adding story to gallery:', error)
      return res.status(500).json({ error: 'Failed to add story to gallery' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
