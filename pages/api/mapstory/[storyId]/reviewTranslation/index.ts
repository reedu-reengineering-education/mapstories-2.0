import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { TranslationStatus } from '@prisma/client'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { withAuthentication } from '@/src/lib/apiMiddlewares/withAuthentication'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { reviewTranslationSchema } from '@/src/lib/validations/mapstory'
import { ensureStoryGroup } from '@/src/lib/story/copyStoryAsTranslation'

// The author of the original story approves or rejects a submitted community
// translation. `storyId` is the id of the translation draft.
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { action } = reviewTranslationSchema.parse(req.body)
    const session = await getServerSession(req, res, authOptions)

    const draft = await db.story.findUnique({
      where: { id: req.query.storyId as string },
      include: { translationOf: true },
    })
    const original = draft?.translationOf
    if (!draft || !original) {
      return res.status(404).end()
    }
    if (original.ownerId !== session?.user.id) {
      return res.status(403).end()
    }
    if (draft.translationStatus !== TranslationStatus.PENDING) {
      return res.status(409).json({ message: 'Translation is not pending' })
    }

    if (action === 'reject') {
      const updated = await db.story.update({
        where: { id: draft.id },
        data: { translationStatus: TranslationStatus.REJECTED },
      })
      return res.status(200).json(updated)
    }

    const languageTaken =
      draft.language === original.language ||
      (original.groupId &&
        (await db.story.count({
          where: { groupId: original.groupId, language: draft.language },
        })) > 0)
    if (languageTaken) {
      return res
        .status(409)
        .json({ code: 'EXISTS', message: 'Story already has this language' })
    }

    const translatorId = draft.ownerId
    const updated = await db.$transaction(async tx => {
      const groupId = await ensureStoryGroup(tx, original)
      return tx.story.update({
        where: { id: draft.id },
        data: {
          group: { connect: { id: groupId } },
          owner: original.ownerId
            ? { connect: { id: original.ownerId } }
            : undefined,
          contributor: translatorId
            ? { connect: { id: translatorId } }
            : undefined,
          visibility: original.visibility,
          defaultLanguage: original.defaultLanguage || original.language,
          translationStatus: TranslationStatus.APPROVED,
        },
      })
    })

    return res.status(200).json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues)
    }
    console.error(error)
    return res.status(500).end()
  }
}

export default withMethods(['POST'], withAuthentication(handler))
