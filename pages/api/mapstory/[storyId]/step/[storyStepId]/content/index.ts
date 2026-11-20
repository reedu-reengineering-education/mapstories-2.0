import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstoryEditor } from '@/src/lib/apiMiddlewares/withMapstoryEditor'
import { z } from 'zod'
import { MediaType } from '@prisma/client'
import parseOG from '@/src/lib/media/ogParser'
import {
  findStory,
  stepBelongsToStory,
  translationReadonly,
} from '@/src/lib/story/storyAccess'
import { syncContentCreated } from '@/src/lib/story/syncTranslations'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const storyStepId = req.query.storyStepId as string

      const story = await findStory(req.query.storyId as string)
      if (!story || !(await stepBelongsToStory(storyStepId, story))) {
        return res.status(404).end()
      }
      if (story.isTranslation) {
        return translationReadonly(res)
      }

      const {
        content: url,
        sourceContentId: _sourceContentId,
        needsTranslation: _needsTranslation,
        ...body
      } = req.body

      const ogData = (await parseOG({ url })) ?? {}

      const newSlideContent = await db.slideContent.create({
        data: {
          ...body,
          content: url,
          type: req.body.type as MediaType,
          storyStepId,
          ogData,
          position:
            (
              await db.storyStep.findFirst({
                where: {
                  id: storyStepId,
                },
                select: {
                  content: true,
                },
              })
            )?.content.length || 0,
        },
      })

      await syncContentCreated(newSlideContent.id)

      res.status(200).json(newSlideContent)

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      res.status(422).json(error)
    }
  }
}

export default withMethods(
  ['POST'],
  withAuthentication(withMapstoryEditor(handler)),
)
