import { getCurrentUser } from '@/src/lib/session'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Viewer',
}

interface ViewerPageProps {}

export default async function ViewerPage({}: ViewerPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return <div></div>
}
