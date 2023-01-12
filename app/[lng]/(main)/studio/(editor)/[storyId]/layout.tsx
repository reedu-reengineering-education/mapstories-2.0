import { Button } from '@/components/Elements/Button'
import MapstorySidebar from '@/components/Studio/Mapstories/Sidebar/MapstorySidebar'
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

      <div className="mt-8 grid w-full flex-1 flex-col gap-12 overflow-hidden md:grid-cols-[200px_1fr]">
        <aside className="flex-col md:flex md:w-[200px]">
          <MapstorySidebar />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      {/*
      <main className="mt-8 flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main> */}
    </>
  )
}
