import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

type Data = { error?: string; success?: boolean }

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

  if (req.method === 'DELETE') {
    try {
      const { galleryStoryId } = req.body

      if (!galleryStoryId) {
        return res.status(400).json({ error: 'galleryStoryId is required' })
      }

      const galleryStory = await db.galleryStory.findUnique({
        where: { id: galleryStoryId },
      })

      if (!galleryStory) {
        return res.status(404).json({ error: 'Gallery story not found' })
      }

      await db.galleryStory.delete({
        where: { id: galleryStoryId },
      })

      // Reorder positions
      const remaining = await db.galleryStory.findMany({
        orderBy: { position: 'asc' },
      })

      for (let i = 0; i < remaining.length; i++) {
        await db.galleryStory.update({
          where: { id: remaining[i].id },
          data: { position: i },
        })
      }

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error removing story from gallery:', error)
      return res.status(500).json({ error: 'Failed to remove story from gallery' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
