import '../styles/globals.css'
import { Inter } from '@next/font/google'
import { cx } from 'class-variance-authority'

const font = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={cx('bg-white text-slate-900 antialiased', font.className)}>
      <body className="min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  )
}
