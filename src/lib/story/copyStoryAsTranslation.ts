import {
  Media,
  MediaType,
  Prisma,
  SlideContent,
  Story,
  StoryStep,
  TranslationStatus,
  Visibility,
} from '@prisma/client'

import { generateSlug } from '@/src/lib/slug'

type Tx = Prisma.TransactionClient

export type ContentWithMedia = SlideContent & { media: Media | null }
export type StepWithContent = StoryStep & { content: ContentWithMedia[] | null }
export type StoryWithSteps = Story & {
  firstStep: StepWithContent | null
  steps: StepWithContent[]
}

export const storyWithStepsInclude = {
  firstStep: { include: { content: { include: { media: true } } } },
  steps: { include: { content: { include: { media: true } } } },
} satisfies Prisma.StoryInclude

export const isTextContent = (type: MediaType) =>
  type === MediaType.TITLE || type === MediaType.TEXT

// Marks copied text as the untranslated original so the translator sees,
// via Markdown, that it still needs to be translated. `isNew` is used for
// content that was added to the original after the translation was created.
export function markUntranslated(
  content: string,
  type: MediaType,
  sourceLang: string,
  isNew = false,
) {
  if (!content) {
    return content
  }
  if (type === MediaType.TITLE) {
    return `${isNew ? '🆕' : '🌐'} ${content}`
  }
  if (type === MediaType.TEXT) {
    const hint = isNew
      ? `🆕 _${sourceLang.toUpperCase()} – neu im Original, bitte übersetzen / new in original, please translate_`
      : `🌐 _${sourceLang.toUpperCase()} – bitte übersetzen / please translate_`
    const quoted = content.replace(/\n/g, '\n> ')
    return `> ${hint}\n>\n> ${quoted}`
  }
  return content
}

// Copies one content item of the original into a translation step, keeping a
// link to its source so later structural changes can be synced.
export async function copyContentToStep(
  tx: Tx,
  slideContent: ContentWithMedia,
  targetStepId: string,
  sourceLang: string,
  isNew = false,
) {
  let newMediaId: string | undefined
  if (slideContent.mediaId) {
    const media =
      slideContent.media ??
      (await tx.media.findUnique({ where: { id: slideContent.mediaId } }))
    if (media) {
      const { id: _id, ...mediaData } = media
      const newMedia = await tx.media.create({
        data: { ...mediaData, name: mediaData.name ?? '' },
      })
      newMediaId = newMedia.id
    }
  }

  return tx.slideContent.create({
    data: {
      type: slideContent.type,
      position: slideContent.position,
      content: markUntranslated(
        slideContent.content,
        slideContent.type,
        sourceLang,
        isNew,
      ),
      options: slideContent.options ?? undefined,
      ogData: slideContent.ogData ?? undefined,
      storyStepId: targetStepId,
      mediaId: newMediaId,
      sourceContentId: slideContent.id,
      needsTranslation: isTextContent(slideContent.type),
    },
  })
}

// Copies a step (incl. content) of the original into a translation story.
export async function copyStepAsTranslation(
  tx: Tx,
  step: StepWithContent,
  storyId: string | null,
  sourceLang: string,
  isNew = false,
) {
  const newStep = await tx.storyStep.create({
    data: {
      storyId,
      position: step.position ?? 0,
      feature: step.feature ?? undefined,
      viewport: step.viewport ?? {},
      timestamp: step.timestamp,
      tags: step.tags,
      sourceStepId: step.id,
    },
  })

  for (const slideContent of step.content ?? []) {
    await copyContentToStep(tx, slideContent, newStep.id, sourceLang, isNew)
  }

  return newStep.id
}

// Ensures the original story belongs to a translation group and returns its id.
export async function ensureStoryGroup(
  tx: Tx,
  original: Pick<Story, 'id' | 'groupId' | 'language'>,
) {
  if (original.groupId) {
    return original.groupId
  }
  const group = await tx.storyGroup.create({ data: {} })
  await tx.story.update({
    where: { id: original.id },
    data: {
      group: { connect: { id: group.id } },
      isTranslation: false,
      defaultLanguage: original.language,
    },
  })
  return group.id
}

// Resolves the original (non-translation) story for a story id or slug.
// Returns null if the story does not exist.
export async function findOriginalStory(
  tx: Pick<Tx, 'story'>,
  storyIdOrSlug: string,
): Promise<StoryWithSteps | null> {
  const story = await tx.story.findFirst({
    where: { OR: [{ id: storyIdOrSlug }, { slug: storyIdOrSlug }] },
    include: {
      ...storyWithStepsInclude,
      group: { select: { stories: { select: { id: true, isTranslation: true } } } },
    },
  })
  if (!story) {
    return null
  }
  if (story.translationOfId) {
    return tx.story.findUnique({
      where: { id: story.translationOfId },
      include: storyWithStepsInclude,
    })
  }
  const originalId = story.group?.stories.find(s => !s.isTranslation)?.id
  if (!originalId || originalId === story.id) {
    return story
  }
  return tx.story.findUnique({
    where: { id: originalId },
    include: storyWithStepsInclude,
  })
}

type CopyOptions = {
  language: string
  ownerId: string | null
  groupId: string | null
  visibility: Visibility
  translationOfId?: string
  translationStatus?: TranslationStatus
}

// Creates a full translation copy (title step + all steps) of `source`.
export async function copyStoryAsTranslation(
  tx: Tx,
  source: StoryWithSteps,
  options: CopyOptions,
) {
  const sourceLang = source.language

  let newFirstStepId: string | undefined
  if (source.firstStep) {
    newFirstStepId = await copyStepAsTranslation(
      tx,
      source.firstStep,
      null,
      sourceLang,
    )
  }

  const created = await tx.story.create({
    data: {
      name: source.name,
      slug: await generateSlug(source.name ?? 'story'),
      description: source.description,
      author: source.author,
      visibility: options.visibility,
      mode: source.mode,
      lines: source.lines,
      community: source.community,
      themeId: source.themeId,
      ownerId: options.ownerId,
      site: source.site,
      language: options.language,
      isTranslation: true,
      groupId: options.groupId,
      firstStepId: newFirstStepId,
      defaultLanguage: source.defaultLanguage || source.language,
      translationOfId: options.translationOfId,
      translationStatus: options.translationStatus,
    },
  })

  for (const step of source.steps) {
    await copyStepAsTranslation(tx, step, created.id, sourceLang)
  }

  return created
}
