import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { Footer } from '@/src/components/Layout/Footer'
import { InverseNavbar } from '@/src/components/Layout/InverseNavbar'
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
    <div className="relative flex h-full flex-col">
      <header className="absolute top-0 left-0 z-10 w-full bg-opacity-50 bg-gradient-to-b from-zinc-800 to-transparent">
        <div className="container flex h-16 items-center justify-between py-4">
          <InverseNavbar>
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
          </InverseNavbar>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      {/* @ts-expect-error Server Component */}
      <Footer lng={lng} />
    </div>
  )
}
