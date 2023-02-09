import { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'

import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'DELETE') {
    try {
      const storyStepId = req.query.stepId as string
      const storyId = req.query.storyId as string
        
      // delete all slideContent associated with the step
      const deletedContent = await db.slideContent.deleteMany({
        where: { storyStepId: storyStepId },
        });
    // delete the step
      const deletedStep = await db.storyStep.delete({
        where: { id: storyStepId },
      })

      res.json(deletedStep)

      return res.end()
    }
    catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(422).end()
    }
  }
}

export default withMethods(['DELETE'], withAuthentication(withMapstory(handler)))
