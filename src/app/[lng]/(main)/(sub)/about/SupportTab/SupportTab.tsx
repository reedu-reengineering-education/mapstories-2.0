import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'

export default function SupportTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'supportTab')

  return (
    <div className="flex flex-col">
      <div>{t('text1')}</div>
    </div>
  )
}
