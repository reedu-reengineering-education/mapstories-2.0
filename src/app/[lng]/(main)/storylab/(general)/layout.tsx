import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { Footer } from '@/src/components/Layout/Footer'
import { Navbar } from '@/src/components/Layout/Navbar'
import { StudioSidebar } from '@/src/components/Studio/Sidebar'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { LinkIcon } from '@heroicons/react/24/outline'
import { User } from '@prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const countStories = async (userId: User['id']) => {
  return await db.story.count({
    where: {
      ownerId: userId,
    },
  })
}

interface DashboardLayoutProps {
  children?: React.ReactNode
  params: { lng: string }
}

export default async function DashboardLayout({
  children,
  params: { lng },
}: DashboardLayoutProps) {
  const user = await getCurrentUser()
  const storyCount = user ? await countStories(user.id) : 0

  if (!user) {
    return redirect('login')
  }

  return (
    <>
      <header className="container sticky top-0 z-50 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <Navbar user={user} userHasStories={storyCount > 0}>
            <div className="flex space-x-2">
              <Button
                className="mr-20 h-8 bg-zinc-700 opacity-90 hover:bg-zinc-100"
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
              <LangSwitcher />
              {user ? (
                <UserAccountNav user={user} />
              ) : (
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </Navbar>
        </div>
      </header>
      <div className="mx-auto my-6 flex flex-col">
        <div className="container grid gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <StudioSidebar />
          </aside>
          <main className="flex min-h-[80vh] w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
      {await Footer({ lng })}
    </>
  )
}
