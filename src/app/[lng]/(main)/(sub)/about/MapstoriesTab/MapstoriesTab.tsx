import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import Link from 'next/link'
import { Button } from '@/src/components/Elements/Button'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'

export default function MapstoriesTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'mapstoriesTab')

  return (
    <div className="flex flex-col gap-10 p-10">
      <div className="align-center flex flex-row gap-10">
        <div>
          <div>
            {/* @ts-ignore */}
            <div>{t('text1')}</div>
          </div>
        </div>
      </div>
      <div className="flex">
        <Link href="mailto:mapstories@vamos-muenster.de">
          <Button startIcon={<EnvelopeClosedIcon className="w-5" />}>
            {/* @ts-ignore */}
            {t('mailToButton')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
