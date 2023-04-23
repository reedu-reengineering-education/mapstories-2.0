import { useTranslation } from '@/src/app/i18n'
import { Button } from '@/src/components/Elements/Button'
import EditMapstoryView from '@/src/components/Studio/Mapstories/EditMapstoryView'
import SettingsModal from '@/src/components/Studio/Mapstories/SettingsModal'
import MapstorySidebar from '@/src/components/Studio/Mapstories/Sidebar/MapstorySidebar'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline'
import { Story, User } from '@prisma/client'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

// export const generateStaticParams =
//   process.env.NODE_ENV !== 'development'
//     ? async () => {
//         return []
//       }
//     : undefined

interface DashboardLayoutProps {
  params: { storyId: string; slug: string; lng: string }
  children?: React.ReactNode
}

async function getStoryForUser(userId: User['id'], slug: Story['slug']) {
  return await db.story.findFirst({
    where: {
      slug: slug,
      ownerId: userId,
    },
    include: {
      firstStep: {
        include: {
          content: true,
        },
      },
      steps: {
        include: {
          content: true,
        },
      },
    },
  })
}

export default async function DashboardLayout({
  params: { slug, lng },
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn!)
  }
  const { t } = await useTranslation(lng, 'dashboardLayout')
  const story = await getStoryForUser(user.id, slug)

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
            {t('back')}
          </Button>
        </Link>
        <a href={`/viewer/story/${slug}/0`} target="_blank">
          <Button startIcon={<EyeIcon className="w-5" />} variant={'inverse'}>
            {t('preview')}
          </Button>
        </a>
        <SettingsModal storyId={story.id} />
      </div>

      <div className="re-studio-height-full-screen mt-8 grid w-full flex-1 flex-col gap-12 overflow-hidden md:grid-cols-[200px_1fr]">
        <aside className="re-studio-height-full-screen flex-col md:flex md:w-[200px]">
          <MapstorySidebar storyID={story.id} />
        </aside>
        <main className="re-studio-height-full-screen relative flex w-full flex-1 flex-col overflow-hidden">
          <EditMapstoryView data-superjson story={story} />
          <div className="absolute left-0 top-0 h-full w-full">{children}</div>
        </main>
      </div>
    </>
  )
}
