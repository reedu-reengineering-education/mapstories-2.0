import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstoryEditor } from '@/src/lib/apiMiddlewares/withMapstoryEditor'
import { db } from '@/src/lib/db'
import { SlideContent } from '@prisma/client'
import {
  findStory,
  stepBelongsToStory,
  translationReadonly,
} from '@/src/lib/story/storyAccess'
import { syncContentPositions } from '@/src/lib/story/syncTranslations'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const storyStepId = req.query.storyStepId as string

      const story = await findStory(req.query.storyId as string)
      if (!story || !(await stepBelongsToStory(storyStepId, story))) {
        return res.status(404).end()
      }
      if (story.isTranslation) {
        return translationReadonly(res)
      }

      const step = await db.storyStep.findFirst({
        where: {
          id: storyStepId,
        },
        include: {
          content: true,
        },
      })

      // content ids from the request, only those belonging to this step
      const contentIds = (req.body as SlideContent[])
        .map(r => r.id)
        .filter(id => step?.content.some(c => c.id === id))

      await db.$transaction(
        contentIds.map((id, i) =>
          db.slideContent.update({
            where: {
              id,
            },
            data: {
              position: i,
            },
          }),
        ),
      )

      await syncContentPositions(storyStepId)

      const stepToReturn = await db.storyStep.findFirst({
        where: {
          id: step?.id,
        },
        include: {
          content: true,
        },
      })

      res.status(200).json(stepToReturn)
    } catch (error) {
      res.status(500).end()
    }
  }
}

export default withMethods(
  ['PUT'],
  withAuthentication(withMapstoryEditor(handler)),
)
