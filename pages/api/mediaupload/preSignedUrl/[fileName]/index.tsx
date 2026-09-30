import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { authOptions } from '@/src/lib/auth'
import { getPresignedUrl } from '@/src/lib/s3'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const method = req.method as 'GET' | 'PUT'

    // reading is public (viewer), uploading requires a logged in user
    if (method === 'PUT') {
      const session = await getServerSession(req, res, authOptions)
      if (!session) {
        return res.status(403).end()
      }
    }

    const fileName = `${req.query.fileName}`
    const url = await getPresignedUrl(method, fileName)
    return res.status(200).json(url)
  } catch (error: any) {
    return res.status(422).json(error.message)
  }
}

export default withMethods(['GET', 'PUT'], handler)
