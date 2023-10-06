import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { InverseNavbar } from '@/src/components/Layout/InverseNavbar'
import { getCurrentUser } from '@/src/lib/session'
import { LinkIcon } from '@heroicons/react/24/outline'
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
            <div className="flex space-x-3">
              <Button
                className="mr-20 h-8 bg-zinc-700 opacity-90 hover:bg-zinc-100 hidden lg:flex"
                startIcon={<LinkIcon className="w-5" />}
              >
                {' '}
                <a
                  href="https://padlet.com/VamosMuenster/feedback-zur-plattform-mapstories-vxeo28o2lzldiwuy"
                  target="_blank"
                >
                  {' '}
                  Feedback
                </a>{' '}
              </Button>

              <div className='hidden lg:flex lg:gap-2 lg:flex-row'>
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
