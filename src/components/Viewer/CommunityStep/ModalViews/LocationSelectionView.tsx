import { Button } from '@/src/components/Elements/Button'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import MiniMap from '../MiniMap/MiniMap'

export default function LocationSelectionView({
  handleAddLocation,
  stepSuggestion,
  onBack,
  onNext,
}: any) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'communityStep')
  return (
    <div className="flex flex-col justify-end gap-4">
      {t('setLocation')}
      <div className="jusitfy-center flex h-64 w-full">
        <MiniMap
          handleAddLocation={handleAddLocation}
          stepSuggestion={stepSuggestion}
        />
      </div>
      <div className="flex flex-row justify-between gap-4">
        <Button onClick={onBack} variant={'inverse'}>
          {t('back')}
        </Button>
        <Button disabled={!stepSuggestion.feature} onClick={onNext}>
          {t('next')}
        </Button>
      </div>
    </div>
  )
}
