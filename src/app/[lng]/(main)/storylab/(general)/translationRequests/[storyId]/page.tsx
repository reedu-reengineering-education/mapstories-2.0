import { StudioHeader } from '@/src/components/Studio/Header'
import { StudioShell } from '@/src/components/Studio/Shell'
import { getCurrentUser } from '@/src/lib/session'
import { notFound, redirect } from 'next/navigation'
import { useTranslation } from '@/src/app/i18n'
import { db } from '@/src/lib/db'
import { Story, User } from '@prisma/client'
import TranslationRequestList from '@/src/components/Studio/Mapstories/TranslationRequests/TranslationRequestList'

async function getStoryForOwner(storyId: Story['id'], userId: User['id']) {
  return await db.story.findFirst({
    where: {
      id: storyId,
      ownerId: userId,
    },
    select: {
      id: true,
      name: true,
      language: true,
      group: { select: { stories: { select: { language: true } } } },
      translationRequests: {
        where: { translationStatus: 'PENDING' },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          slug: true,
          language: true,
          updatedAt: true,
          owner: { select: { name: true, email: true } },
        },
      },
    },
  })
}

export default async function TranslationRequestsPage({
  params: { lng, storyId },
}: {
  params: { lng: string; storyId: string }
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/')
  }
  const { t } = await useTranslation(lng, 'translationRequests')
  const story = await getStoryForOwner(storyId, user.id)
  if (!story) {
    return notFound()
  }

  const existingLanguages = story.group?.stories.map(s => s.language) ?? [
    story.language,
  ]

  return (
    <StudioShell>
      <StudioHeader
        heading={t('reviewHeading', { story: story.name ?? '' })}
        text={t('reviewDescription')}
      ></StudioHeader>
      <TranslationRequestList
        existingLanguages={existingLanguages}
        requests={story.translationRequests.map(r => ({
          id: r.id,
          slug: r.slug,
          language: r.language,
          submittedAt: r.updatedAt.toISOString(),
          translator: r.owner?.name ?? r.owner?.email ?? '',
        }))}
      />
    </StudioShell>
  )
}
