import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

type PublicStory = {
  id: string
  name: string | null
}

type Data = { success: true; stories: PublicStory[] } | { error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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

  try {
    const publicStories = await db.story.findMany({
      where: {
        visibility: 'PUBLIC',
        isTranslation: false,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      success: true,
      stories: publicStories,
    })
  } catch (error) {
    console.error('Error fetching public stories:', error)
    return res.status(500).json({ error: 'Failed to fetch public stories' })
  }
}
