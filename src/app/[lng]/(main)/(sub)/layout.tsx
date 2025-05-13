import { getCurrentUser } from '@/src/lib/session'
import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import Link from 'next/link'
import { InverseNavbar } from '@/src/components/Layout/InverseNavbar'
import { LinkIcon } from '@heroicons/react/24/outline'
import { User } from '@prisma/client'
import { db } from '@/src/lib/db'

const countStories = async (userId: User['id']) => {
  return await db.story.count({
    where: {
      ownerId: userId,
    },
  })
}

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode
  params: { lng: string }
}) {
  const user = await getCurrentUser()
  const storyCount = user ? await countStories(user.id) : 0

  return (
    <div className="relative flex h-full flex-col">
      <header className="absolute left-0 top-0 z-50 w-full bg-opacity-50 bg-gradient-to-b from-zinc-800 to-transparent">
        <div className="container flex h-16 items-center justify-between py-4">
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
              </Button>
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
      <main className="max-w-full flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
