import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

type Data = { email?: string; role?: string; error?: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { email: true, role: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({ email: user.email, role: user.role })
  } catch (error) {
    console.error('Error fetching current user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
