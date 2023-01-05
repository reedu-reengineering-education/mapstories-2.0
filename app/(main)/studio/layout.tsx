import { notFound } from 'next/navigation'

import { getCurrentUser } from '@/lib/session'

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
    <div className="mx-auto flex flex-col space-y-6 py-8">
      <main className="container flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
