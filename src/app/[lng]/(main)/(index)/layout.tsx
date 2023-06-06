import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { FeedbackButton } from '@/src/components/FeedbackButton'
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
      <header className="absolute left-0 top-0 z-10 w-full bg-opacity-50 bg-gradient-to-b from-zinc-800 to-transparent">
        <div className="container flex h-16 items-center justify-between py-4">
          <InverseNavbar user={user}>
            <div className="flex space-x-2">
              <FeedbackButton />

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
      <main className="max-w-full flex-1 overflow-hidden">{children}</main>
      {/* @ts-expect-error Server Component */}
      <Footer lng={lng} />
    </div>
  )
}
