import { Button } from '@/src/components/Elements/Button'
import EditMapstoryView from '@/src/components/Studio/Mapstories/EditMapstoryView'
import MapstorySidebar from '@/src/components/Studio/Mapstories/Sidebar/MapstorySidebar'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Story, User } from '@prisma/client'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import SettingsModal from '@/src/components/Studio/Mapstories/SettingsModal'

export const generateStaticParams =
  process.env.NODE_ENV !== 'development'
    ? async () => {
        return []
      }
    : undefined

interface DashboardLayoutProps {
  params: { storyId: string; slug: string; lng: string }
  children?: React.ReactNode
}

async function getStoryForUser(
  // storyId: Story['id'],
  userId: User['id'],
  slug: Story['slug'],
) {
  return await db.story.findFirst({
    where: {
      slug: slug,
      ownerId: userId,
    },
    include: {
      steps: {
        include: {
          content: true,
        },
      },
    },
  })
}

export default async function DashboardLayout({
  params: { storyId, slug, lng },
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn!)
  }

  const story = await getStoryForUser(user.id, slug)

  const storySteps = story?.steps

  if (!story) {
    return notFound()
  }

  return (
    <>
      <div className="flex flex-row gap-2">
        <Link href={'/studio'}>
          <Button
            startIcon={<ArrowLeftIcon className="w-5" />}
            variant={'inverse'}
          >
            Zurück
          </Button>
        </Link>
        <SettingsModal
          description={story.description || ''}
          isPublic={story.visibility !== 'PRIVATE'}
          lng={lng}
          storyId={story.id}
          theme={story.theme || ''}
          title={story.name || ''}
        />
      </div>

      <div className="re-studio-height-full-screen mt-8 grid w-full flex-1 flex-col gap-12 overflow-hidden md:grid-cols-[200px_1fr]">
        <aside className="re-studio-height-full-screen flex-col md:flex md:w-[200px]">
          <MapstorySidebar lng={lng} storyID={story.id} />
        </aside>
        <main className="re-studio-height-full-screen relative flex w-full flex-1 flex-col overflow-hidden">
          <EditMapstoryView data-superjson steps={storySteps} story={story} />
          <div className="absolute top-0 left-0 h-full w-full">{children}</div>
        </main>
      </div>
    </>
  )
}
