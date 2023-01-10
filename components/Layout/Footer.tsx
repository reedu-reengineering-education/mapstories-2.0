import { useTranslation } from '@/app/i18n'
import { fallbackLng, languages } from '@/app/i18n/settings'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export async function Footer({ lng }: { lng: string }) {
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = await useTranslation(lng, 'footer')

  return (
    <footer className="container bg-white text-slate-600">
      <div className="flex  flex-col items-center justify-between gap-4 border-t border-t-slate-200 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <GlobeAltIcon className="w-8" />
          <p className="text-center text-sm leading-loose md:text-left">
            {t('builtBy')}{' '}
            <Link
              className="font-medium underline underline-offset-4"
              href={'#'}
              rel="noreferrer"
              target="_blank"
            >
              reedu
            </Link>
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
