import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { canManageSite } from '@/src/lib/site'
import { Site } from '@prisma/client'

type Data =
  | {
      success: true
      stories: any[]
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

  const site = req.query.site === 'BFDW' ? Site.BFDW : Site.MAIN

  if (!canManageSite(user?.role, site)) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' })
  }

  if (req.method === 'GET') {
    try {
      const galleryStories = await db.galleryStory.findMany({
        where: { site },
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
        orderBy: { position: 'asc' },
      })

      return res.status(200).json({
        success: true,
        stories: galleryStories,
      })
    } catch (error) {
      console.error('Error fetching gallery stories:', error)
      return res.status(500).json({ error: 'Failed to fetch gallery stories' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
