import { StudioHeader } from '@/src/components/Studio/Header'
import { StudioShell } from '@/src/components/Studio/Shell'
import { getCurrentUser } from '@/src/lib/session'
import { redirect } from 'next/navigation'
import { useTranslation } from '@/src/app/i18n'
import { db } from '@/src/lib/db'
import { Story } from '@prisma/client'
import StepSuggestionsForm from '@/src/components/Studio/Mapstories/StepSuggestions/StepSuggestionsForm'

async function getStory(storyId: Story['id']) {
  return await db.story.findFirst({
    where: {
      id: storyId,
    },
    include: {
      steps: {
        include: {
          content: true,
        },
      },
      stepSuggestions: {
        include: {
          content: true,
        },
      },
    },
  })
}

export default async function StepSuggestionsPage({
  params: { lng, storyId },
}: {
  params: { lng: string; storyId: string }
}) {
  const user = await getCurrentUser()
  const { t } = await useTranslation(lng, 'stepSuggestions')
  const story = await getStory(storyId)
  if (!user) {
    redirect('/')
  }

  return (
    <StudioShell>
      <StudioHeader
        heading={t('stepSuggestions')}
        text={t('stepSuggestionsDescription')}
      ></StudioHeader>
      <StepSuggestionsForm
        // @ts-expect-error
        story={story}
      />
    </StudioShell>
  )
}
