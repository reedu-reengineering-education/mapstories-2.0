import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { InverseNavbar } from '@/src/components/Layout/InverseNavbar'
import ViewerView from '@/src/components/Viewer/ViewerView'
import { getCurrentUser } from '@/src/lib/session'
import { LinkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface ViewerLayoutProps {
  children?: React.ReactNode
  params: { filter: string }
}

export default async function ViewerLayout({ children }: ViewerLayoutProps) {
  const user = await getCurrentUser()

  // const mapstories = await getMapstories()

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 z-10 w-full bg-opacity-50 bg-gradient-to-b from-zinc-800 to-transparent">
        <header className="container sticky top-0">
          <div className="flex h-16 items-center justify-between py-4">
            <InverseNavbar user={user}>
              <div className="flex space-x-2">
                <Button
                  className="mr-20 h-8 bg-zinc-700 opacity-90 hover:bg-zinc-100"
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
            </InverseNavbar>
          </div>
        </header>
      </div>
      <div className="absolute left-0 top-0 h-full w-full">{children}</div>
      <ViewerView data-superjson inputStories={[]}></ViewerView>
    </div>
  )
}
