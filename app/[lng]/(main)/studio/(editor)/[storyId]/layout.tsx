import { Button } from '@/components/Elements/Button'
import { getCurrentUser } from '@/lib/session'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <>
      <Link href={'/studio'}>
        <Button
          startIcon={<ArrowLeftIcon className="w-5" />}
          variant={'inverse'}
        >
          Zurück
        </Button>
      </Link>

      <main className="mt-8 flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </>
  )
}
