import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { TranslationStatus, Visibility } from '@prisma/client'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { isStoryLanguage } from '@/src/lib/languageFlags'
import { translationRequestSchema } from '@/src/lib/validations/mapstory'
import {
  copyStoryAsTranslation,
  findOriginalStory,
} from '@/src/lib/story/copyStoryAsTranslation'

// Lets a logged in user (not the author) start a community translation of a
// public story. The copy stays private and outside the story group until the
// author approves it.
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { language } = translationRequestSchema.parse(req.body)
    if (!isStoryLanguage(language)) {
      return res.status(422).json({ message: 'Unsupported language' })
    }

    const session = await getServerSession(req, res, authOptions)
    const userId = session!.user.id

    const original = await findOriginalStory(db, req.query.storyId as string)
    if (!original || original.visibility !== Visibility.PUBLIC) {
      return res.status(404).end()
    }
    if (original.ownerId === userId) {
      return res
        .status(409)
        .json({ code: 'OWNER', message: 'Use the storylab to add languages' })
    }

    const existingLanguages = original.groupId
      ? await db.story.findMany({
          where: { groupId: original.groupId },
          select: { language: true },
        })
      : [{ language: original.language }]
    if (existingLanguages.some(s => s.language === language)) {
      return res
        .status(409)
        .json({ code: 'EXISTS', message: 'Story already has this language' })
    }

    // Continue an unfinished draft of this user instead of creating another.
    const existingDraft = await db.story.findFirst({
      where: {
        translationOfId: original.id,
        ownerId: userId,
        language,
        translationStatus: {
          in: [
            TranslationStatus.DRAFT,
            TranslationStatus.PENDING,
            TranslationStatus.REJECTED,
          ],
        },
      },
      select: { slug: true, firstStepId: true },
    })
    if (existingDraft) {
      return res.status(200).json(existingDraft)
    }

    const created = await db.$transaction(tx =>
      copyStoryAsTranslation(tx, original, {
        language,
        ownerId: userId,
        groupId: null,
        visibility: Visibility.PRIVATE,
        translationOfId: original.id,
        translationStatus: TranslationStatus.DRAFT,
      }),
    )

    return res
      .status(200)
      .json({ slug: created.slug, firstStepId: created.firstStepId })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues)
    }
    console.error(error)
    return res.status(500).end()
  }
}

export default withMethods(['POST'], withAuthentication(handler))
