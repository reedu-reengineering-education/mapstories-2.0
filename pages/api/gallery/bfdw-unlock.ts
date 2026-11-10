import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { BFDW_GALLERY_UNLOCK_COOKIE } from '@/src/lib/bfdwGallery'

type Data = { success: true } | { error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body

  if (!process.env.BFDW_GALLERY_PASSWORD) {
    return res.status(500).json({ error: 'Gallery password is not configured' })
  }

  if (password !== process.env.BFDW_GALLERY_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' })
  }

  const cookieAttributes = [
    `${BFDW_GALLERY_UNLOCK_COOKIE}=1`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${60 * 60 * 24 * 365}`,
    ...(process.env.NODE_ENV === 'production' ? ['Secure'] : []),
  ]
  res.setHeader('Set-Cookie', cookieAttributes.join('; '))

  const session = await getServerSession(req, res, authOptions)
  if (session?.user?.id) {
    await db.user.update({
      where: { id: session.user.id },
      data: { bfdwGalleryUnlocked: true },
    })
  }

  return res.status(200).json({ success: true })
}
