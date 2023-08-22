import { useTranslation } from '@/src/app/i18n'
import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { InverseNavbar } from '@/src/components/Layout/InverseNavbar'
import { PreviewButton } from '@/src/components/PreviewButton'
import EditMapstoryView from '@/src/components/Studio/Mapstories/EditMapstoryView'
import SettingsModal from '@/src/components/Studio/Mapstories/SettingsModal'
import MapstorySidebar from '@/src/components/Studio/Mapstories/Sidebar/MapstorySidebar'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { ArrowLeftIcon, LinkIcon } from '@heroicons/react/24/outline'
import { Story, User } from '@prisma/client'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

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
      theme: true,
    },
  })
}

async function getThemes() {
  return await db.theme.findMany({})
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
  const themes = await getThemes()

  if (!story) {
    return notFound()
  }

  return (
    <>
      <div className="absolute left-0 top-0 z-10 z-50 w-full bg-opacity-50 bg-gradient-to-b from-zinc-800 to-transparent">
        <header className="container sticky top-0">
          <div className="flex h-16 items-center justify-between py-4">
            <InverseNavbar user={user}>
              <div className="flex space-x-2">
                <Button
                  className="mr-20 h-8 bg-zinc-700 opacity-90 hover:bg-zinc-100"
                  startIcon={<LinkIcon className="w-5" />}
                >
                  {' '}
                  <a
                    href="https://padlet.com/VamosMuenster/feedback-zur-plattform-mapstories-vxeo28o2lzldiwuy"
                    target="_blank"
                  >
                    {' '}
                    Feedback
                  </a>{' '}
                </Button>{' '}
                <LangSwitcher />
                {user ? (
                  <UserAccountNav user={user} />
                ) : (
                  <Link href="/login">
                    <Button>Login</Button>
                  </Link>
                )}
              </div>
            </InverseNavbar>
          </div>
        </header>
      </div>
      <div className="absolute top-20 z-20 box-border flex w-full justify-between px-5">
        <div className="flex flex-row gap-2">
          <Link href={'/storylab'}>
            <Button
              className="re-basic-box"
              startIcon={<ArrowLeftIcon className="w-5" />}
              variant={'inverse'}
            >
              {t('back')}
            </Button>
          </Link>
          <PreviewButton story={story} />
          <SettingsModal shadow storyId={story.id} themes={themes} />
        </div>
      </div>

      <div className="re-studio-height-full-minus-header z-30 mt-40 w-full flex-1 flex-col overflow-hidden">
        <aside className="re-studio-height-full-screen absolute bottom-14 w-[185px]">
          <MapstorySidebar storyID={story.id} />
        </aside>
        <main className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-full">{children}</div>
        </main>
      </div>
      <EditMapstoryView data-superjson story={story} />
    </>
  )
}
