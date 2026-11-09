'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'

// Individual sub-components for each content type view
export default function InitialView() {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'communityStep')
  return (
    <div className="flex flex-col gap-4">
      <p>{t('intro')}</p>
      <p>{t('introReview')}</p>
    </div>
  )
}
