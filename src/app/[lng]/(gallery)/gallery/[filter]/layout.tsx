import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { InverseNavbar } from '@/src/components/Layout/InverseNavbar'
import ViewerView from '@/src/components/Viewer/ViewerView'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { LinkIcon } from '@heroicons/react/24/outline'
import { User } from '@prisma/client'
import Link from 'next/link'

const getCertifiedMapstories = async (array: Array<string>) => {
  return await db.story.findMany({
    where: {
      visibility: 'PUBLIC',
      OR: [
        {
          id: {
            in: array,
          },
        },
        {
          slug: {
            in: array,
          },
        },
      ],
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

interface ViewerLayoutProps {
  children?: React.ReactNode
  params: { filter: string }
}

export default async function ViewerLayout({ children }: ViewerLayoutProps) {
  const user = await getCurrentUser()
  const certifiedMapstoryIDs: Array<string> =
    process.env.GALLERY_STORIES?.split(',') ?? []

  const mapstories = await getCertifiedMapstories(certifiedMapstoryIDs)
  const storyCount = user ? await countStories(user.id) : 0

  return (
    <div className="relative h-full w-full">
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
                    href="https://www.taskcards.de/#/board/1b41a521-922e-471c-949b-b0d132c903c7/view "
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
      <div className="absolute left-0 top-0 h-full w-full">{children}</div>
      <ViewerView data-superjson inputStories={mapstories}></ViewerView>
    </div>
  )
}
