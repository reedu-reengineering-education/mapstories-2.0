import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { Media, MediaType, Prisma } from '@prisma/client'
import { StoryStep } from '@prisma/client'
import { SlideContent } from '@prisma/client'

import { withMethods } from '@/src/lib/apiMiddlewares/withMethods'
import { db } from '@/src/lib/db'
import { withMapstory } from '@/src/lib/apiMiddlewares/withMapstory'
import { generateSlug } from '@/src/lib/slug'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth/next'
import { addLanguageSchema } from '@/src/lib/validations/mapstory'
import { languages } from '@/src/app/i18n/settings'

type ExtendedSlideContent = SlideContent & { media: Media | null }
type ExtendedStoryStep = StoryStep & { content: ExtendedSlideContent[] | null }

// Marks copied text as the untranslated original so the language author sees,
// via Markdown, that it still needs to be translated.
function markUntranslated(content: string, type: MediaType, sourceLang: string) {
  if (!content) {
    return content
  }
  if (type === MediaType.TITLE) {
    return `🌐 ${content}`
  }
  if (type === MediaType.TEXT) {
    const quoted = content.replace(/\n/g, '\n> ')
    return `> 🌐 _${sourceLang.toUpperCase()} – bitte übersetzen / please translate_\n>\n> ${quoted}`
  }
  return content
}

async function createStepContent(
  transaction: any,
  step: ExtendedStoryStep,
  newStepId: string,
  sourceLang: string,
) {
  for (const slideContent of step?.content ?? []) {
    let newMedia
    if (slideContent.mediaId && slideContent.media) {
      const { id, ...mediaData } = slideContent.media
      newMedia = await transaction.media.create({
        data: {
          ...mediaData,
          name: mediaData?.name ?? '',
        },
      })
    }
    const { id, media, ...content } = slideContent
    await transaction.slideContent.create({
      data: {
        ...content,
        content: markUntranslated(content.content, content.type, sourceLang),
        storyStepId: newStepId,
        mediaId: newMedia?.id ?? undefined,
        options: content.options ?? undefined,
        ogData: content.ogData ?? undefined,
      },
    })
  }
}

async function createStep(
  transaction: any,
  step: ExtendedStoryStep,
  storyId: string | null,
  sourceLang: string,
) {
  const { id, content, ...stepData } = step
  const newStep = await transaction.storyStep.create({
    data: {
      ...stepData,
      storyId,
      position: stepData?.position ?? 0,
      feature: stepData?.feature ?? undefined,
      viewport: stepData?.viewport ?? {},
    },
  })

  await createStepContent(transaction, step, newStep.id, sourceLang)

  return newStep.id
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const storyId = req.query.storyId as string
    const { language } = addLanguageSchema.parse(req.body)

    try {
      if (!languages.includes(language)) {
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
          firstStep: {
            include: { content: { include: { media: true } } },
          },
          steps: {
            include: { content: { include: { media: true } } },
          },
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

      // Find the default language story (the one with isTranslation=false)
      // We always copy from the default language, not the current one
      let defaultLanguageStory: any = story
      if (story.group?.stories && !story.group.stories.some(s => !s.isTranslation)) {
        // Group doesn't have a default story yet, use current
        defaultLanguageStory = story
      } else if (story.group?.stories) {
        const originalStoryId = story.group.stories.find(s => !s.isTranslation)?.id
        if (originalStoryId && originalStoryId !== story.id) {
          defaultLanguageStory = await db.story.findUniqueOrThrow({
            where: { id: originalStoryId },
            include: {
              firstStep: { include: { content: { include: { media: true } } } },
              steps: { include: { content: { include: { media: true } } } },
            },
          })
        }
      }

      const sourceLang = defaultLanguageStory.language

      const newStory = await db.$transaction(async transaction => {
        // ensure a translation group exists and the original belongs to it
        let groupId = story.groupId
        if (!groupId) {
          const group = await transaction.storyGroup.create({ data: {} })
          groupId = group.id
          await transaction.story.update({
            where: { id: story.id },
            data: {
              group: { connect: { id: groupId } },
              isTranslation: false,
              defaultLanguage: story.language,
            } as any,
          })
        }

        let newFirstStepId: string | undefined
        if (defaultLanguageStory.firstStep) {
          newFirstStepId = await createStep(
            transaction,
            defaultLanguageStory.firstStep as ExtendedStoryStep,
            null,
            sourceLang,
          )
        }

        const created = await transaction.story.create({
          data: {
            name: defaultLanguageStory.name,
            slug: await generateSlug(defaultLanguageStory.name ?? 'story'),
            description: defaultLanguageStory.description,
            author: defaultLanguageStory.author,
            visibility: defaultLanguageStory.visibility,
            mode: defaultLanguageStory.mode,
            lines: defaultLanguageStory.lines,
            community: defaultLanguageStory.community,
            themeId: defaultLanguageStory.themeId,
            ownerId: defaultLanguageStory.ownerId,
            language,
            isTranslation: true,
            groupId,
            firstStepId: newFirstStepId,
            defaultLanguage: (defaultLanguageStory as any).defaultLanguage || defaultLanguageStory.language,
          } as any,
        })

        for (const step of defaultLanguageStory.steps) {
          await createStep(transaction, step as ExtendedStoryStep, created.id, sourceLang)
        }

        return created
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
