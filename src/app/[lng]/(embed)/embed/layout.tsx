import { LogoWithTextAndBackground } from '@/src/components/Layout/MapstoriesLogo'
import ViewerView from '@/src/components/Viewer/ViewerView'
import { getCurrentUser } from '@/src/lib/session'

interface ViewerLayoutProps {
  children?: React.ReactNode
}

export default async function ViewerLayout({ children }: ViewerLayoutProps) {
  const user = await getCurrentUser()

  // const mapstories = await getMapstories()

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 z-10 w-full">
        <header className="sticky top-0">
          <div className="flex h-16 items-center justify-between py-4 pl-6">
            <LogoWithTextAndBackground />
          </div>
        </header>
      </div>
      <div className="absolute left-0 top-0 h-full w-full">{children}</div>
      <ViewerView data-superjson inputStories={[]}></ViewerView>
    </div>
  )
}
