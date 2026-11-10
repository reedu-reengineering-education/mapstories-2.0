import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { canManageSite } from '@/src/lib/site'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  })

  if (user?.role !== 'ADMIN' && user?.role !== 'SITE_ADMIN_BFDW') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' })
  }

  const { storyId, targetUserEmail } = req.body

  if (!storyId || !targetUserEmail) {
    return res.status(400).json({
      error: 'Story ID and target user email are required',
    })
  }

  try {
    const story = await db.story.findUnique({
      where: { id: storyId },
    })

    if (!story) {
      return res.status(404).json({ error: 'Story not found' })
    }

    // SITE_ADMIN_BFDW may only manage stories of the BFDW site
    if (!canManageSite(user.role, story.site)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' })
    }

    const targetUser = await db.user.findUnique({
      where: { email: targetUserEmail },
    })

    if (!targetUser) {
      return res.status(404).json({
        error: 'Target user not found',
      })
    }

    // Transfer ownership
    const transferredStory = await db.story.update({
      where: { id: storyId },
      data: {
        ownerId: targetUser.id,
      },
    })

    return res.status(200).json({
      success: true,
      message: `Story transferred successfully to ${targetUserEmail}`,
      story: {
        id: transferredStory.id,
        name: transferredStory.name,
        previousOwnerId: story.ownerId,
        newOwnerId: targetUser.id,
      },
    })
  } catch (error) {
    console.error('Error transferring story:', error)
    return res.status(500).json({
      error: 'Failed to transfer story',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
