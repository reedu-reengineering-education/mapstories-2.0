import { Button } from '@/src/components/Elements/Button'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import StepSuggestionCard from '@/src/components/Studio/Mapstories/StepSuggestions/StepSuggestionCard'

export default function ConfirmationView({
  onBack,
  onConfirm,
  stepSuggestion,
}: any) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'communityStep')
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2 mt-2 text-sm text-gray-500">
        {t('confirmDescription')}
      </div>
      <div></div>
      <div className="">
        <StepSuggestionCard stepSuggestion={stepSuggestion} />
      </div>
      <div className="flex flex-row justify-end gap-4">
        <Button onClick={onBack} variant={'inverse'}>
          {t('back')}
        </Button>
        <Button onClick={onConfirm}>{t('confirm')}</Button>
      </div>
    </div>
  )
}
