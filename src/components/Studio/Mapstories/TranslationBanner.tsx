'use client'

import Link from 'next/link'
import { LanguageIcon } from '@heroicons/react/24/outline'

import { Tooltip } from '@/src/components/Tooltip'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import { getLanguageInfo } from '@/src/lib/languageFlags'

type Props = {
  original: {
    name: string | null
    language: string
    slug: string
    firstStepId: string | null
  }
  // the link to the original is only useful if the user may edit it
  canEditOriginal: boolean
}

// Shown in the editor of a translation: only texts can be changed here,
// markers, steps, media and order are managed in the original story.
export default function TranslationBanner({ original, canEditOriginal }: Props) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'translationRequests')
  const info = getLanguageInfo(original.language)

  return (
    <Tooltip content={t('bannerDetails') as string} maxwidth="320px" side="bottom">
      <div className="re-basic-box flex items-center gap-2 bg-amber-50 px-3 py-1 text-sm text-amber-900">
        <LanguageIcon className="h-5 w-5 shrink-0" />
        <span>
          {t('bannerTitle', {
            story: original.name ?? '',
            flag: info.flag,
          })}
        </span>
        {canEditOriginal && original.firstStepId && (
          <Link
            className="font-medium underline hover:text-amber-700"
            href={`/storylab/${original.slug}/${original.firstStepId}`}
          >
            {t('toOriginal')}
          </Link>
        )}
      </div>
    </Tooltip>
  )
}
