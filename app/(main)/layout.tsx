import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <Navbar />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
