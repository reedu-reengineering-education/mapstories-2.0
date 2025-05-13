import { useTranslation } from '@/src/app/i18n'
import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { InverseNavbar } from '@/src/components/Layout/InverseNavbar'
import { PreviewButton } from '@/src/components/PreviewButton'
import EditMapstoryView from '@/src/components/Studio/Mapstories/EditMapstoryView'
import SettingsModal from '@/src/components/Studio/Mapstories/SettingsModal'
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

const countStories = async (userId: User['id']) => {
  return await db.story.count({
    where: {
      ownerId: userId,
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
  const storyCount = user ? await countStories(user.id) : 0

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
      <div className="absolute left-0 top-0 z-50 w-full bg-opacity-50 bg-gradient-to-b from-zinc-800 to-transparent">
        <header className="container sticky top-0">
          <div className="flex h-16 items-center justify-between py-4">
            <InverseNavbar user={user} userHasStories={storyCount > 0}>
              <div className="flex space-x-2">
                <Button
                  className="mr-20 hidden h-8 bg-zinc-700 opacity-90 hover:bg-zinc-100 lg:flex"
                  startIcon={<LinkIcon className="w-5" />}
                >
                  {' '}
                  <a
                    href="https://www.taskcards.de/#/board/1b41a521-922e-471c-949b-b0d132c903c7/view?token=2cea14db-2cd2-4664-9852-400ea9d0aa0d"
                    target="_blank"
                  >
                    {' '}
                    Feedback
                  </a>{' '}
                </Button>{' '}
                <div className="hidden lg:flex lg:flex-row lg:gap-2">
                  <LangSwitcher />
                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link href="/login">
                      <Button>Login</Button>
                    </Link>
                  )}
                </div>
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
          <SettingsModal shadow storyId={story.id} themes={themes} />
          <PreviewButton story={story} />
        </div>
      </div>

      <div className="re-studio-height-full-minus-header z-30 mt-40 w-full flex-1 flex-col overflow-hidden">
        <div className="h-full w-full">{children}</div>
      </div>
      <EditMapstoryView data-superjson story={story} />
    </>
  )
}
