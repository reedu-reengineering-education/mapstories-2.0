import { getCurrentUser } from '@/src/lib/session'
import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Viewer',
  openGraph: {
    title: 'Viewer',
  },
}
interface ViewerPageProps {}

export default async function ViewerPage({}: ViewerPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return <div></div>
}
