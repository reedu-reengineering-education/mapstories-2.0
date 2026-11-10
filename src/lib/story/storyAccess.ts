import type { NextApiResponse } from 'next'

import { db } from '@/src/lib/db'

// Users who may edit a story's content: its owner and its contributors
// (e.g. the translator of an approved community translation).
export const storyEditorWhere = (userId: string | undefined) => ({
  OR: [{ ownerId: userId }, { contributor: { some: { id: userId } } }],
})

export async function findStory(storyIdOrSlug: string) {
  return db.story.findFirst({
    where: { OR: [{ id: storyIdOrSlug }, { slug: storyIdOrSlug }] },
    select: {
      id: true,
      ownerId: true,
      isTranslation: true,
      firstStepId: true,
      groupId: true,
      translationOfId: true,
    },
  })
}

export async function stepBelongsToStory(
  stepId: string,
  story: { id: string; firstStepId: string | null },
) {
  if (stepId === story.firstStepId) {
    return true
  }
  const count = await db.storyStep.count({
    where: { id: stepId, storyId: story.id },
  })
  return count > 0
}

// Translations may only change texts; structure is managed in the original.
export function translationReadonly(res: NextApiResponse) {
  return res.status(403).json({
    code: 'TRANSLATION_READONLY',
    message:
      'Translations can only change texts. Edit the structure in the original story.',
  })
}
