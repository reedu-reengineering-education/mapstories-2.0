import { GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="container bg-white text-slate-600">
      <div className="flex  flex-col items-center justify-between gap-4 border-t border-t-slate-200 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <GlobeAltIcon className="w-8" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{' '}
            <Link
              className="font-medium underline underline-offset-4"
              href={'#'}
              rel="noreferrer"
              target="_blank"
            >
              reedu
            </Link>
            . Hosted on{' '}
            <Link
              className="font-medium underline underline-offset-4"
              href="https://vercel.com"
              rel="noreferrer"
              target="_blank"
            >
              Vercel
            </Link>
            .
          </p>
        </div>
        <p className="text-center text-sm md:text-left">
          The source code is available on{' '}
          <Link
            className="font-medium underline underline-offset-4"
            href={'#'}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  )
}
