import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

type Data = { error?: string; success?: boolean; user?: any }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
  })

  if (currentUser?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Only admins can manage users' })
  }

  if (req.method === 'PUT') {
    try {
      const { email, role } = req.body

      if (!email || !role) {
        return res.status(400).json({ error: 'email and role are required' })
      }

      if (!['ADMIN', 'USER'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be ADMIN or USER' })
      }

      const user = await db.user.findUnique({
        where: { email },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const updatedUser = await db.user.update({
        where: { email },
        data: { role },
      })

      return res.status(200).json({
        success: true,
        user: { email: updatedUser.email, role: updatedUser.role },
      })
    } catch (error) {
      console.error('Error updating user role:', error)
      return res.status(500).json({ error: 'Failed to update user role' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
