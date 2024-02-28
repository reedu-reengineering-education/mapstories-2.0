import NextAuth from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/src/lib/auth'


export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  console.log('auth api', req.method, req.url, req.query, req.body, req.headers)
  //https://next-auth.js.org/tutorials/avoid-corporate-link-checking-email-provider
  if (req.method === 'HEAD') {
    res.status(200).end(); 
    return;
  }
  // if user agent is a bot, return 404
  
  if (req.headers['user-agent']?.match(/bot|preview|crawler|spider/i)) {
    res.status(200).end()
    return
  }

  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, authOptions)
}