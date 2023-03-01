import ViewerView from '@/src/components/Viewer/ViewerView'
import { db } from '@/src/lib/db'

interface ViewerLayoutProps {
  children?: React.ReactNode
}

const getMapstories = async () => {
  return await db.story.findMany({
    include: {
      steps: {
        include: {
          content: true
        }
      }
    }
  })
}

export default async function ViewerLayout({
  children
}: ViewerLayoutProps) {
  
  const mapstories = await getMapstories()

  return (
    <div className="w-full h-full">
        <div className="absolute top-0 left-0 h-full w-full">{children}</div>
        <ViewerView stories={mapstories}></ViewerView>
    </div>
  )
}
