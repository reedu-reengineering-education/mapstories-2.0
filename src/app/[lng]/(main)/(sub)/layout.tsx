import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { Footer } from '@/src/components/Layout/Footer'
import { Navbar } from '@/src/components/Layout/Navbar'
import { getCurrentUser } from '@/src/lib/session'
import Link from 'next/link'

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode
  params: { lng: string }
}) {
  const user = await getCurrentUser()

  return (
    <div className="flex h-full flex-col">
      <header className="container sticky top-0 z-10 bg-white">
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
      <main className="container mx-auto my-6 flex-1">{children}</main>
      {/* @ts-expect-error Server Component */}
      <Footer lng={lng} />
    </div>
  )
}
