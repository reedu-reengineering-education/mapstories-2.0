import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { z } from 'zod'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const storyId = req.query.storyId as string

      const newStep = await db.storyStep.create({
        data: {
          storyId,
          viewport: {},
          position: await db.storyStep.count(),
        },
      })

      res.json(newStep)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }

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

  if (req.method === 'DELETE') {
    try {
      const storyStepId = req.query.stepId as string
      const storyId = req.query.storyId as string

      // delete all slideContent associated with the step
      const deletedContent = await db.slideContent.deleteMany({
        where: { storyStepId: storyStepId },
      })
      // delete the step
      const deletedStep = await db.storyStep.delete({
        where: { id: storyStepId },
      })

      res.json(deletedStep)

      return res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(
  ['POST', 'PUT', 'DELETE'],
  withAuthentication(withMapstory(handler)),
)
