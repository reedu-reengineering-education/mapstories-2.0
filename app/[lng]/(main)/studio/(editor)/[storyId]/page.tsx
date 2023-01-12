import { notFound, redirect } from 'next/navigation'

import { Story, User } from '@prisma/client'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { authOptions } from '@/lib/auth'
import { StudioShell } from '@/components/Studio/Shell'
import { StudioHeader } from '@/components/Studio/Header'
import Map from '@/components/Map'
import DrawControl from '@/components/Map/DrawControl'
import { useStoryStore } from '@/lib/store/story'

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
  const storyTest = useStoryStore();

  if (!story) {
    return notFound()
  }

  return (
    <StudioShell>
      <StudioHeader heading={story.name || ''} text={story.id} />
      <div className="relative h-96 w-full overflow-hidden rounded-lg shadow">
        <Map>
          <DrawControl
            controls={{
              polygon: true,
              point: true,
              trash: true,
            }}
            displayControlsDefault={false}
            position="top-left"
          />
        </Map>
      </div>
    </StudioShell>
  )
}
