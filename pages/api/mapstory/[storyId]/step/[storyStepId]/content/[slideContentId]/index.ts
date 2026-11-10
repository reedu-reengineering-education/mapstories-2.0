import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/src/lib/db'
import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { withMapstoryEditor } from '@/src/lib/apiMiddlewares/withMapstoryEditor'
import { z } from 'zod'
import parseOG from '@/src/lib/media/ogParser'
import { isTextContent } from '@/src/lib/story/copyStoryAsTranslation'
import {
  findStory,
  stepBelongsToStory,
  translationReadonly,
} from '@/src/lib/story/storyAccess'
import {
  syncContentDeleted,
  syncContentUpdated,
} from '@/src/lib/story/syncTranslations'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slideContentId = req.query.slideContentId as string
  const storyStepId = req.query.storyStepId as string

  const story = await findStory(req.query.storyId as string)
  const existing = await db.slideContent.findUnique({
    where: { id: slideContentId },
    select: { storyStepId: true, type: true },
  })
  if (
    !story ||
    !existing ||
    existing.storyStepId !== storyStepId ||
    !(await stepBelongsToStory(storyStepId, story))
  ) {
    return res.status(404).end()
  }

  if (req.method === 'PUT') {
    try {
      // Translations may only change the text of TITLE/TEXT content.
      if (story.isTranslation) {
        if (!isTextContent(existing.type)) {
          return translationReadonly(res)
        }
        const content = z.string().parse(req.body.content)
        const updatedContent = await db.slideContent.update({
          where: { id: slideContentId },
          data: { content, needsTranslation: false },
        })
        return res.status(200).json(updatedContent)
      }

      const {
        content: url,
        sourceContentId: _sourceContentId,
        needsTranslation: _needsTranslation,
        storyStepId: _stepId,
        ...body
      } = req.body

      const ogData = (await parseOG({ url })) ?? {}

      const updatedContent = await db.slideContent.update({
        where: { id: slideContentId },
        data: { ...body, content: url, options: req.body.options ?? {}, ogData },
      })

      await syncContentUpdated(updatedContent)

      res.status(200).json(updatedContent)

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      res.status(422).json(error)
    }
  }
  if (req.method === 'DELETE') {
    if (story.isTranslation) {
      return translationReadonly(res)
    }
    try {
      await syncContentDeleted(slideContentId)

      const deletedContent = await db.slideContent.delete({
        where: {
          id: slideContentId,
        },
      })
      // Get all slide contents for the given story step id
      const slideContents = await db.slideContent.findMany({
        where: {
          storyStepId,
        },
      })

      // Update the position of each slide content
      await db.$transaction(
        slideContents
          .sort((a, b) => a.position - b.position)
          .map((content, index) => {
            return db.slideContent.update({
              where: {
                id: content.id,
              },
              data: {
                position: index,
              },
            })
          }),
      )

      res.status(200).json(deletedContent)

      res.end()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      res.status(422).end()
    }
  }
}

export default withMethods(
  ['PUT', 'DELETE'],
  withAuthentication(withMapstoryEditor(handler)),
)
