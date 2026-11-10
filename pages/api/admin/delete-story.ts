import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { canManageSite } from '@/src/lib/site'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
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

  const { storyId } = req.body

  if (!storyId) {
    return res.status(400).json({ error: 'Story ID is required' })
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

    // Delete all related data in cascade
    await db.storyStep.deleteMany({
      where: { storyId },
    })

    // Delete the story (this should cascade other deletions)
    await db.story.delete({
      where: { id: storyId },
    })

    return res.status(200).json({
      success: true,
      message: `Story "${story.name}" deleted successfully`,
      storyId: story.id,
    })
  } catch (error) {
    console.error('Error deleting story:', error)
    return res.status(500).json({
      error: 'Failed to delete story',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
