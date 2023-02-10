import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const story = await db.storyStep.update({
        where: {
          id: req.query.storyStepId as string,
        },
        data: {
          feature: {
            point: {
              latitude: req.body.feature.point.latitude as number,
              longitude: req.body.feature.point.longitude as number,
            },
          },
        },
      })
      res.status(200).json(story)
      return res.end()
    } catch (error) {
      return res.status(500).end()
    }
  }
}
export default withMethods(['PUT'], withAuthentication(withMapstory(handler)))
