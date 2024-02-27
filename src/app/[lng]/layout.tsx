import '@/src/styles/globals.scss'
import localFont from 'next/font/local'
import { cx } from 'class-variance-authority'
import { dir } from 'i18next'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next/types'

const Providers = dynamic(() => import('./Providers'), { ssr: false })

const interLocal = localFont({
  src: [
    {
      path: '../../../assets/fonts/Inter/static/Inter-Thin.ttf',
      weight: '100',
    },
    {
      path: '../../../assets/fonts/Inter/static/Inter-ExtraLight.ttf',
      weight: '200',
    },
    {
      path: '../../../assets/fonts/Inter/static/Inter-Light.ttf',
      weight: '300',
    },
    {
      path: '../../../assets/fonts/Inter/static/Inter-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../../assets/fonts/Inter/static/Inter-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../../assets/fonts/Inter/static/Inter-SemiBold.ttf',
      weight: '600',
    },
    {
      path: '../../../assets/fonts/Inter/static/Inter-Bold.ttf',
      weight: '700',
    },
    {
      path: '../../../assets/fonts/Inter/static/Inter-ExtraBold.ttf',
      weight: '800',
    },
  ],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Mapstories',
    template: '%s | Mapstories',
  },
  description: 'Globale Geschichten interaktiv erzählen',
  robots: {
    index: true,
  },
  openGraph: {
    title: {
      default: 'Mapstories',
      template: '%s | Mapstories',
    },
    type: 'website',
  },
}

// ISR not working at the moment
// export async function generateStaticParams() {
//   return languages.map(lng => ({ lng }))
// }

// export const generateStaticParams =
//   process.env.NODE_ENV !== 'development'
//     ? async () => {
//         return languages.map(lng => ({ lng }))
//       }
//     : undefined

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
      className={cx(
        'g-white h-full w-full text-slate-900 antialiased',
        interLocal.variable,
      )}
      dir={dir(lng)}
      lang={lng}
    >
      <body className="h-full w-full">
        <script
          async
          data-website-id="b05f27c8-dc51-4d85-bb5e-faaa183ff3ff"
          src="https://umami.mapstories.de/script.js"
        ></script>
        <main className="h-full w-full">
          {/* @ts-ignore */}
          <Providers lng={lng}>{children}</Providers>
        </main>
      </body>
    </html>
  )
}
