import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { z } from 'zod'
import { db } from '@/src/lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'GET') {
        try {
            const mediaId = req.query.mediaId as string
            const media = await db.image.findUnique({
                where: {
                    id: mediaId
                }
            })
            res.json(media)
            return res.end()
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(422).json(error.issues)
                }
            return res.status(422).json(error)
        }
        }
    }

    export default withMethods(['GET'], withAuthentication(handler))
