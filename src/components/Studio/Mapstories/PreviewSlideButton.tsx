'use client'

import { EyeIcon } from '@heroicons/react/24/outline'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'

export default function PreviewSlideButton() {
  const { showSlidePreview, setShowSlidePreview } = useBoundStore()
    const lng = useBoundStore(state => state.language)

    const { t } = useTranslation(lng, [
      'studio',
    ])

  if (showSlidePreview) {
    return <></>
  }
  return (
    <>
      <div
        className="absolute right-0 top-0 m-1 flex items-center whitespace-nowrap hover:cursor-pointer"
        onClick={() => setShowSlidePreview(true)}
      >
        <span>{t('studio:preview')}</span>
        <EyeIcon className="m-2 inline-block w-5 hover:cursor-pointer" />
      </div>
    </>
  )
}
