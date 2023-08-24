import { getCurrentUser } from '@/src/lib/session'
import ViewerView from '@/src/components/Viewer/ViewerView'

interface ViewerLayoutProps {
  children?: React.ReactNode
  params: { filter: string }
}

export default async function ViewerLayout({ children }: ViewerLayoutProps) {
  const user = await getCurrentUser()

  // const mapstories = await getMapstories()

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 h-full w-full">{children}</div>
      <ViewerView data-superjson inputStories={[]}></ViewerView>
    </div>
  )
}
