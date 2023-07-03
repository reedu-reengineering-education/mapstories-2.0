import { getCurrentUser } from '@/src/lib/session'

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode
  params: { lng: string }
}) {
  const user = await getCurrentUser()
  return (
    <>
      <div className="flex h-full flex-col">
        <main className="h-full">{children}</main>
      </div>
    </>
  )
}
