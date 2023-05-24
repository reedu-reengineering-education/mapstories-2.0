import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { Footer } from '@/src/components/Layout/Footer'
import { Navbar } from '@/src/components/Layout/Navbar'
import { StudioSidebar } from '@/src/components/Studio/Sidebar'
import { getCurrentUser } from '@/src/lib/session'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface DashboardLayoutProps {
  children?: React.ReactNode
  params: { lng: string }
}

export default async function DashboardLayout({
  children,
  params: { lng },
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <>
      <header className="container sticky top-0 z-50 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <Navbar>
            <div className="flex space-x-2">
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
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
      {/* @ts-expect-error Server Component */}
      <Footer lng={lng} />
    </>
  )
}
