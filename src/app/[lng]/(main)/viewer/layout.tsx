import ViewerView from '@/src/components/Viewer/ViewerView'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { redirect } from 'next/navigation'

interface ViewerLayoutProps {
  children?: React.ReactNode
}

const getMapstories = async (userId: string) => {
  return await db.story.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      firstStep: {
        include: {
          content: true,
        },
      },
      steps: {
        include: {
          content: true,
        },
      },
    },
  })
}

export default async function ViewerLayout({ children }: ViewerLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  const mapstories = await getMapstories(user.id)

  return (
    <div className="h-full w-full">
      <div className="absolute top-0 left-0 h-full w-full">{children}</div>
      <ViewerView stories={mapstories}></ViewerView>
    </div>
  )
}
