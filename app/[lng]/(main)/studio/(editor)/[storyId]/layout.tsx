import { Button } from '@/components/Elements/Button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export const generateStaticParams =
  process.env.NODE_ENV !== 'development'
    ? async () => {
        return []
      }
    : undefined

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
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
