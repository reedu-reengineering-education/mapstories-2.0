import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import Link from 'next/link'
import { Button } from '@/src/components/Elements/Button'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'

export default function SupportTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'supportTab')

  return (
    <div className="flex flex-col gap-10 p-10">
      <div className="flex flex-row items-center gap-20">
        <div className="flex flex-col gap-2">
          {/* @ts-ignore */}
          <div>{t('text1')}</div>
          <p>
            <b>{t('text2Title')}</b>
          </p>
          <p>{t('text2')}</p>

          <p>
            <b>{t('text3Title')}</b>
          </p>
          <p>{t('text3')}</p>

          <p>
            <b>{t('text4Title')}</b>
          </p>
          <p>{t('text4')}</p>

          <p>
            <b>{t('text5Title')}</b>
          </p>
          <p>{t('text5')}</p>
        </div>
      </div>
      <div>
        <Link href="mailto:mapstories@vamos-muenster.de">
          <Button startIcon={<EnvelopeClosedIcon className="w-5" />}>
            {/* @ts-ignore */}
            {t('buttonInquiry')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
