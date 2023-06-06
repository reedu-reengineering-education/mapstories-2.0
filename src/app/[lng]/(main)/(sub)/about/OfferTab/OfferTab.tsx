import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import VamosLogo from '@/assets/images/partners/logo_vamos.jpeg'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/src/components/Elements/Button'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'

export default function OfferTab() {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'offerTab')

  return (
    <div className="flex flex-col gap-10 p-10">
      <div className="align-center flex flex-row gap-10">
        <div>
          <div>
            <h3>{t('offerTitle')}</h3>
            <p>{t('offerText')}</p>
          </div>
        </div>
        <div className="p-10">
          <Image alt="Vamos logo" src={VamosLogo} />
        </div>
      </div>
      <div className="flex">
        <Link href="mailto:mapstories@vamos-muenster.de">
          <Button startIcon={<EnvelopeClosedIcon className="w-5" />}>
            {t('mailToButton')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
