import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { canManageSite } from '@/src/lib/site'

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

  if (req.method === 'PUT') {
    try {
      const { galleryStoryIds } = req.body

      if (!Array.isArray(galleryStoryIds)) {
        return res.status(400).json({ error: 'galleryStoryIds must be an array' })
      }

      const items = await db.galleryStory.findMany({
        where: { id: { in: galleryStoryIds } },
      })

      if (
        items.length === 0 ||
        !items.every(item => canManageSite(user?.role, item.site))
      ) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' })
      }

      // Update positions based on new order
      for (let i = 0; i < galleryStoryIds.length; i++) {
        await db.galleryStory.update({
          where: { id: galleryStoryIds[i] },
          data: { position: i },
        })
      }

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error reordering gallery stories:', error)
      return res.status(500).json({ error: 'Failed to reorder gallery stories' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
