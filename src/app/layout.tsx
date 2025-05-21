import '@/src/styles/globals.scss'

import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { LinkIcon } from '@heroicons/react/24/outline'
import { User } from '@prisma/client'
import Link from 'next/link'
import { Navbar } from '@/src/components/Layout/Navbar'
import localFont from 'next/font/local'



const interLocal = localFont({
  src: [
    {
      path: '../../assets/fonts/Inter/static/Inter-Thin.ttf',
      weight: '100',
    },
    {
      path: '../../assets/fonts/Inter/static/Inter-ExtraLight.ttf',
      weight: '200',
    },
    {
      path: '../../assets/fonts/Inter/static/Inter-Light.ttf',
      weight: '300',
    },
    {
      path: '../../assets/fonts/Inter/static/Inter-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../assets/fonts/Inter/static/Inter-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../assets/fonts/Inter/static/Inter-SemiBold.ttf',
      weight: '600',
    },
    {
      path: '../../assets/fonts/Inter/static/Inter-Bold.ttf',
      weight: '700',
    },
    {
      path: '../../assets/fonts/Inter/static/Inter-ExtraBold.ttf',
      weight: '800',
    },
  ],
  variable: '--font-inter',
})

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
    <html>
    <body>
    <div className="relative flex h-full flex-col">
        <div className="container flex h-16 items-center justify-between py-4">
          <Navbar user={user} userHasStories={storyCount > 0}>
            <div className="flex space-x-3">
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
          </Navbar>
        </div>
      <main className="max-w-full flex-1 overflow-hidden">{children}</main>
    </div>
    </body>

    </html>
    
  )
}
