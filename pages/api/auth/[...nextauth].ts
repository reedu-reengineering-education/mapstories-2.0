import NextAuth from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/src/lib/auth'


export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  console.log('auth api', req.method, req.url, req.query, req.body, req.headers)
  //https://next-auth.js.org/tutorials/avoid-corporate-link-checking-email-provider
  if (req.method === 'HEAD') {
    console.log('HEAD request');
    return res.status(200).end()
  }

  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, authOptions)
}