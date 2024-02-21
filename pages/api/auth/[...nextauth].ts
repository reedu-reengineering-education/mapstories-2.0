import NextAuth from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import type { NextApiRequest, NextApiResponse } from 'next'
// @see ./lib/auth
export async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'HEAD') {
    return res.status(200).end()
  }
}

export default NextAuth(authOptions)
