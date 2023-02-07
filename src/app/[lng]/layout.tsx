import '@/src/styles/globals.scss'
import { Inter } from '@next/font/google'
import { cx } from 'class-variance-authority'
import { Toaster } from '@/src/lib/toast'
import { dir } from 'i18next'
import { languages } from '../i18n/settings'
import Providers from './Providers'

const font = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

// ISR not working at the moment
// export async function generateStaticParams() {
//   return languages.map(lng => ({ lng }))
// }

export const generateStaticParams =
  process.env.NODE_ENV !== 'development'
    ? async () => {
      return languages.map(lng => ({ lng }))
    }
    : undefined

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode
  params: {
    lng: string
  }
}) {
  return (
    <html
      className={cx('bg-white text-slate-900 antialiased', font.className)}
      dir={dir(lng)}
      lang={lng}
    >
      <body className="min-h-screen">
        <main>
          <Providers>{children}</Providers>
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}