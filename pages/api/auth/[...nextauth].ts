import NextAuth from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import type { NextApiRequest, NextApiResponse } from 'next'
// @see ./lib/auth
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'HEAD') {
    console.log('hallo')
    res.status(200).end()
  }
  return NextAuth(authOptions)
}

