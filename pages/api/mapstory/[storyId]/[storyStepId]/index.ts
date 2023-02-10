import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'Put') {
    console.log(req.body)
    console.log(req.query)
    try {
      const story = await db.storyStep.update({
        where: {
          id: req.query.storyId as string,
        },
        data: {
          feature: {
            point: {
              latitude: req.body.latitude as number,
              longitude: req.body.longitude as number,
            },
          },
        },
      })
      return res.status(200).json(story)
    } catch (error) {
      return res.status(500).end()
    }
  }
}
export default withMethods(['PUT'], withAuthentication(withMapstory(handler)))
