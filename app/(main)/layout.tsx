import { UserAccountNav } from '@/components/Auth/UserAccountNav'
import { Button } from '@/components/Elements/Button'
import { Footer } from '@/components/Layout/Footer'
import { Navbar } from '@/components/Layout/Navbar'
import { getCurrentUser } from '@/lib/session'
import Link from 'next/link'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container sticky top-0 z-10 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <Navbar>
            {user ? (
              <UserAccountNav user={user} />
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </Navbar>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
