import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { Footer } from '@/src/components/Layout/Footer'
import { Navbar } from '@/src/components/Layout/Navbar'
import { StudioSidebar } from '@/src/components/Studio/Sidebar'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { User } from '@prisma/client'
import { redirect } from 'next/navigation'

const countStories = async (userId: User['id']) => {
  return await db.story.count({
    where: {
      ownerId: userId,
    },
  })
}

interface BfdwAdminLayoutProps {
  children?: React.ReactNode
  params: { lng: string }
}

// Same chrome as /storylab/admin, but reachable by both the global ADMIN
// and the site-scoped SITE_ADMIN_BFDW role.
export default async function BfdwAdminLayout({
  children,
  params: { lng },
}: BfdwAdminLayoutProps) {
  const user = await getCurrentUser()
  const storyCount = user ? await countStories(user.id) : 0

  if (!user) {
    return redirect('/login')
  }

  if (user.role !== 'ADMIN' && user.role !== 'SITE_ADMIN_BFDW') {
    return redirect(`/${lng}/storylab`)
  }

  return (
    <>
      <header className="container sticky top-0 z-50 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <Navbar user={user} userHasStories={storyCount > 0}>
            <div className="flex space-x-2">
              <LangSwitcher />
          <UserAccountNav user={user} />

            </div>
          </Navbar>
        </div>
      </header>
      <div className="container flex h-full flex-1 gap-12 py-8">
        <aside className="w-48 flex-shrink-0">
          <StudioSidebar />
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="pr-6">{children}</div>
        </main>
      </div>
      <Footer />
    </>
  )
}
