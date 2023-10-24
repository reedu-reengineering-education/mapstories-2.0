import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import { Button } from '@/src/components/Elements/Button'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import WorkshopFoto from '@/assets/images/workshops/Bildungsangebote-1.jpg'
export default function OfferTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'offerTab')

  return (
    <div className="flex flex-col gap-10 p-10">
      <div className="flex flex-row items-center gap-20">
        <div className="flex w-8/12 flex-col gap-2">
          {/* @ts-ignore */}
          <div>{t('text1')}</div>
          <p>
            {/* @ts-ignore */}

            <b>{t('text2Title')}</b>
          </p>
          {/* @ts-ignore */}
          <p>{t('text2')}</p>
          <p>
            {/* @ts-ignore */}
            <b>{t('text3Title')}</b>
          </p>
          {/* @ts-ignore */}
          <p>{t('text3')}</p>
          <p>
            {/* @ts-ignore */}
            <b>{t('text4Title')}</b>
          </p>
          {/* @ts-ignore */}
          <p>
            {t('text4')}{' '}
            <a className="text-blue-500" href="">
              {t('subjects')}
            </a>{' '}
            {t('text4_part2')}
          </p>
          <p>
            {/* @ts-ignore */}
            <b>{t('text5Title')}</b>
          </p>
          {/* @ts-ignore */}
          <p>{t('text5')}</p>
        </div>
        <div className="flex w-4/12 flex-col items-center gap-2">
          <Image alt="Workshop Foto" src={WorkshopFoto} />
          {/* @ts-ignore */}

          <span className="text-slate-600">{t('imageSubtitle')}</span>
        </div>
      </div>
      <div>
        <a href="mailto:mapstories@vamos-muenster.de">
          <Button startIcon={<EnvelopeClosedIcon className="w-5" />}>
            {/* @ts-ignore */}
            {t('buttonInquiry')}
          </Button>
        </a>
      </div>
    </div>
  )
}
