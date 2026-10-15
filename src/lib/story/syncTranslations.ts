import { Prisma, StoryMode } from '@prisma/client'

import { db } from '@/src/lib/db'
import {
  copyContentToStep,
  copyStepAsTranslation,
  isTextContent,
} from '@/src/lib/story/copyStoryAsTranslation'

// Structural changes in an original story are mirrored into all of its
// translations (approved group members and open community drafts). Steps and
// contents are matched via sourceStepId / sourceContentId.

async function findTranslationStoryIds(originalId: string) {
  const original = await db.story.findUnique({
    where: { id: originalId },
    select: { groupId: true, isTranslation: true },
  })
  if (!original || original.isTranslation) {
    return []
  }
  const translations = await db.story.findMany({
    where: {
      id: { not: originalId },
      isTranslation: true,
      OR: [
        { translationOfId: originalId },
        ...(original.groupId ? [{ groupId: original.groupId }] : []),
      ],
    },
    select: { id: true },
  })
  return translations.map(t => t.id)
}

// Logs instead of throwing: the original change already succeeded and must
// not be reported as failed because a translation could not be updated.
async function safely(name: string, fn: () => Promise<void>) {
  try {
    await fn()
  } catch (error) {
    console.error(`[syncTranslations] ${name} failed`, error)
  }
}

// Sorts items so that linked ones follow their source position and unlinked
// (legacy) ones keep their relative place, then returns them renumbered.
function renumber<T extends { id: string; position: number }>(
  items: T[],
  sourcePosition: (item: T) => number | undefined,
) {
  return items
    .map(item => {
      const pos = sourcePosition(item)
      return { item, key: pos ?? item.position + 0.5 }
    })
    .sort((a, b) => a.key - b.key)
    .map(({ item }, index) => ({ id: item.id, position: index }))
}

export function syncStepPositions(originalStoryId: string) {
  return safely('syncStepPositions', async () => {
    const translationIds = await findTranslationStoryIds(originalStoryId)
    if (translationIds.length === 0) {
      return
    }
    const sourceSteps = await db.storyStep.findMany({
      where: { storyId: originalStoryId },
      select: { id: true, position: true },
    })
    const sourcePos = new Map(sourceSteps.map(s => [s.id, s.position]))

    for (const storyId of translationIds) {
      const steps = await db.storyStep.findMany({
        where: { storyId },
        select: { id: true, position: true, sourceStepId: true },
      })
      const order = renumber(steps, s =>
        s.sourceStepId ? sourcePos.get(s.sourceStepId) : undefined,
      )
      await db.$transaction(
        order.map(s =>
          db.storyStep.update({
            where: { id: s.id },
            data: { position: s.position },
          }),
        ),
      )
    }
  })
}

export function syncStepCreated(originalStoryId: string, stepId: string) {
  return safely('syncStepCreated', async () => {
    const translationIds = await findTranslationStoryIds(originalStoryId)
    if (translationIds.length === 0) {
      return
    }
    const [original, step] = await Promise.all([
      db.story.findUniqueOrThrow({
        where: { id: originalStoryId },
        select: { language: true },
      }),
      db.storyStep.findUniqueOrThrow({
        where: { id: stepId },
        include: { content: { include: { media: true } } },
      }),
    ])

    await db.$transaction(async tx => {
      for (const storyId of translationIds) {
        await copyStepAsTranslation(tx, step, storyId, original.language, true)
      }
    })
  }).then(() => syncStepPositions(originalStoryId))
}

export function syncStepUpdated(
  stepId: string,
  data: { feature?: Prisma.InputJsonValue; timestamp?: Date | string; tags?: string[] },
) {
  return safely('syncStepUpdated', async () => {
    await db.storyStep.updateMany({
      where: { sourceStepId: stepId },
      data,
    })
  })
}

// Must run before the original step is deleted (the link is set to null on delete).
export function syncStepDeleted(stepId: string) {
  return safely('syncStepDeleted', async () => {
    const steps = await db.storyStep.findMany({
      where: { sourceStepId: stepId },
      select: { id: true },
    })
    const ids = steps.map(s => s.id)
    if (ids.length === 0) {
      return
    }
    await db.$transaction([
      db.slideContent.deleteMany({ where: { storyStepId: { in: ids } } }),
      db.storyStep.deleteMany({ where: { id: { in: ids } } }),
    ])
  })
}

export function syncContentPositions(originalStepId: string) {
  return safely('syncContentPositions', async () => {
    const [sourceContents, translatedSteps] = await Promise.all([
      db.slideContent.findMany({
        where: { storyStepId: originalStepId },
        select: { id: true, position: true },
      }),
      db.storyStep.findMany({
        where: { sourceStepId: originalStepId },
        select: {
          content: { select: { id: true, position: true, sourceContentId: true } },
        },
      }),
    ])
    const sourcePos = new Map(sourceContents.map(c => [c.id, c.position]))

    for (const step of translatedSteps) {
      const order = renumber(step.content, c =>
        c.sourceContentId ? sourcePos.get(c.sourceContentId) : undefined,
      )
      await db.$transaction(
        order.map(c =>
          db.slideContent.update({
            where: { id: c.id },
            data: { position: c.position },
          }),
        ),
      )
    }
  })
}

export function syncContentCreated(contentId: string) {
  return safely('syncContentCreated', async () => {
    const content = await db.slideContent.findUniqueOrThrow({
      where: { id: contentId },
      include: {
        media: true,
        storyStep: {
          select: {
            id: true,
            Story: { select: { language: true } },
            storyTitleStep: { select: { language: true } },
          },
        },
      },
    })
    const step = content.storyStep
    if (!step) {
      return
    }
    const sourceLang =
      step.Story?.language ?? step.storyTitleStep?.language ?? 'de'
    const translatedSteps = await db.storyStep.findMany({
      where: { sourceStepId: step.id },
      select: { id: true },
    })
    if (translatedSteps.length === 0) {
      return
    }

    await db.$transaction(async tx => {
      for (const target of translatedSteps) {
        await copyContentToStep(tx, content, target.id, sourceLang, true)
      }
    })
  }).then(() => syncContentPositionsForContent(contentId))
}

async function syncContentPositionsForContent(contentId: string) {
  const content = await db.slideContent.findUnique({
    where: { id: contentId },
    select: { storyStepId: true },
  })
  if (content?.storyStepId) {
    await syncContentPositions(content.storyStepId)
  }
}

// Text changes are not propagated so existing translations are never
// overwritten; media/embed changes are mirrored.
export function syncContentUpdated(content: {
  id: string
  type: string
  content: string
  options: Prisma.JsonValue
  ogData: Prisma.JsonValue
}) {
  return safely('syncContentUpdated', async () => {
    if (isTextContent(content.type as any)) {
      return
    }
    await db.slideContent.updateMany({
      where: { sourceContentId: content.id },
      data: {
        content: content.content,
        options: content.options ?? Prisma.JsonNull,
        ogData: content.ogData ?? Prisma.JsonNull,
      },
    })
  })
}

// Must run before the original content is deleted.
export function syncContentDeleted(contentId: string) {
  return safely('syncContentDeleted', async () => {
    const contents = await db.slideContent.findMany({
      where: { sourceContentId: contentId },
      select: { id: true, storyStepId: true },
    })
    if (contents.length === 0) {
      return
    }
    await db.slideContent.deleteMany({
      where: { id: { in: contents.map(c => c.id) } },
    })
    const stepIds = Array.from(
      new Set(contents.map(c => c.storyStepId).filter(Boolean) as string[]),
    )
    for (const storyStepId of stepIds) {
      const remaining = await db.slideContent.findMany({
        where: { storyStepId },
        orderBy: { position: 'asc' },
        select: { id: true },
      })
      await db.$transaction(
        remaining.map((c, index) =>
          db.slideContent.update({
            where: { id: c.id },
            data: { position: index },
          }),
        ),
      )
    }
  })
}

export function syncStorySettings(
  originalStoryId: string,
  data: { mode: StoryMode; lines: boolean; themeId?: string | null },
) {
  return safely('syncStorySettings', async () => {
    const translationIds = await findTranslationStoryIds(originalStoryId)
    if (translationIds.length === 0) {
      return
    }
    await db.story.updateMany({
      where: { id: { in: translationIds } },
      data,
    })
  })
}

// Media rows are duplicated per translation; mirror metadata changes
// (size, source, caption, ...) made in the original.
export function syncMediaUpdated(
  mediaId: string,
  data: Prisma.MediaUpdateManyMutationInput,
) {
  return safely('syncMediaUpdated', async () => {
    const translatedContents = await db.slideContent.findMany({
      where: {
        sourceContent: { mediaId },
        storyStep: {
          OR: [
            { Story: { isTranslation: true } },
            { storyTitleStep: { isTranslation: true } },
          ],
        },
      },
      select: { mediaId: true },
    })
    const mediaIds = translatedContents
      .map(c => c.mediaId)
      .filter((id): id is string => !!id && id !== mediaId)
    if (mediaIds.length === 0) {
      return
    }
    await db.media.updateMany({ where: { id: { in: mediaIds } }, data })
  })
}
