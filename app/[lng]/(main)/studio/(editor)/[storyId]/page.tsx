import { notFound, redirect } from 'next/navigation'

import { Story, User } from '@prisma/client'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { authOptions } from '@/lib/auth'
import { StudioShell } from '@/components/Studio/Shell'
import { StudioHeader } from '@/components/Studio/Header'

async function getStoryForUser(storyId: Story['id'], userId: User['id']) {
  return await db.story.findFirst({
    where: {
      id: storyId,
      ownerId: userId,
    },
  })
}

interface EditorPageProps {
  params: { storyId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn!)
  }

  const story = await getStoryForUser(params.storyId, user.id)

  if (!story) {
    return notFound()
  }

  return (
    <StudioShell>
      <StudioHeader heading={story.name || ''} text={story.id} />
    </StudioShell>
  )
}
