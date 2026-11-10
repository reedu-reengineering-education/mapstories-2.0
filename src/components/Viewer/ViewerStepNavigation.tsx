'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { useBoundStore } from '@/src/lib/store/store'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useTranslation } from '@/src/app/i18n/client'
import { useViewerNavigation } from '@/src/lib/hooks/useViewerNavigation'

type Props = {
  slug: string[]
  story: any
}

const navButton =
  'flex h-10 items-center gap-1 rounded-full border-2 border-button-color px-4 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40'

export function ViewerStepNavigation({ slug, story }: Props) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  // @ts-ignore useTranslation type overloads are complex
  const { t } = useTranslation(lng, 'viewer')

  const total = story?.steps?.length ?? 0
  const { prevStep, nextStep, canGoPrev, canGoNext } = useViewerNavigation({
    slug,
    totalSteps: total,
  })
  const current = parseInt(slug[1]) + 1
  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0

  return (
    <>
      <button
        className={`${navButton} bg-white pl-2 text-button-color hover:bg-slate-50`}
        disabled={!canGoPrev}
        onClick={prevStep}
      >
        <ChevronLeftIcon className="h-5 w-5" />
        {t('previous')}
      </button>

      <div className="flex min-w-[4rem] flex-1 flex-col items-center gap-1">
        <span className="text-sm font-medium tabular-nums">
          {current} / {total}
        </span>
        <div className="h-1 w-full max-w-[8rem] overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-button-color transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        className={`${navButton} bg-button-color pr-2 text-white hover:opacity-90`}
        disabled={!canGoNext}
        onClick={nextStep}
      >
        {t('next')}
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </>
  )
}
