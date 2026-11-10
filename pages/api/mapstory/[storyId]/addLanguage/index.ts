import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { Prisma } from '@prisma/client'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import {
  copyStoryAsTranslation,
  ensureStoryGroup,
  findOriginalStory,
} from '@/src/lib/story/copyStoryAsTranslation'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth/next'
import { addLanguageSchema } from '@/src/lib/validations/mapstory'
import { isStoryLanguage } from '@/src/lib/languageFlags'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const storyId = req.query.storyId as string
    const { language } = addLanguageSchema.parse(req.body)

    try {
      if (!isStoryLanguage(language)) {
        return res.status(422).json({ message: 'Unsupported language' })
      }

      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      const story = await db.story.findFirst({
        where: {
          OR: [{ id: storyId }, { slug: storyId }],
        },
        include: {
          group: { include: { stories: { select: { id: true, language: true, isTranslation: true } } } },
        },
      })

      if (!story) {
        return res.status(404).end()
      }
      if (user?.id !== story.ownerId) {
        return res.status(401).end()
      }
      if (language === story.language) {
        return res
          .status(409)
          .json({ message: 'Story already has this language' })
      }
      if (story.group?.stories.some(s => s.language === language)) {
        return res
          .status(409)
          .json({ message: 'Story already has this language' })
      }

      // We always copy from the default language (original), not the current one
      const defaultLanguageStory = (await findOriginalStory(db, story.id))!

      const newStory = await db.$transaction(async transaction => {
        // ensure a translation group exists and the original belongs to it
        const groupId = await ensureStoryGroup(transaction, defaultLanguageStory)

        return copyStoryAsTranslation(transaction, defaultLanguageStory, {
          language,
          ownerId: defaultLanguageStory.ownerId,
          groupId,
          visibility: defaultLanguageStory.visibility,
        })
      })

      return res.status(200).json(newStory)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(422).json({ message: error.message })
      }
      return res.status(422).end()
    }
  }
}

export default withMethods(['POST'], withMapstory(handler))
