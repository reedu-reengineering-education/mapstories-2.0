import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import { Button } from '@/src/components/Elements/Button'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import WorkshopFoto from '@/assets/images/workshops/Bildungsangebote-1.jpg'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/Elements/Card'
export default function OfferTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'offerTab')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('text1')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center">
          <div className="basis-2/3 p-2">
            <div>
              <b>{t('text2Title')}</b>
              <p>{t('text2')}</p>
            </div>
            <div>
              <b>{t('text3Title')}</b>
              <p>{t('text3')}</p>
            </div>
            <div>
              <p>
                <b>{t('text4Title')}</b>
              </p>
              <span>
                {/* @ts-ignore */}
                {t('text4')}
              </span>
              <p>
                <a className="text-blue-500" href="">
                  {/* @ts-ignore */}
                  {t('subjects')}
                </a>
                <span>
                  {/* @ts-ignore */}
                  {t('text4_part2')}
                </span>
              </p>
            </div>
            <div>
              <p>
                {/* @ts-ignore */}
                <b>{t('text5Title')}</b>
              </p>
              {/* @ts-ignore */}
              <p>{t('text5')}</p>
            </div>
          </div>
          <div className="flex w-4/12 flex-col items-center gap-2">
            <Image alt="Workshop Foto" src={WorkshopFoto} />
            {/* @ts-ignore */}

            <span className="text-slate-600">{t('imageSubtitle')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div>
          <a href="mailto:mapstories@vamos-muenster.de">
            <Button startIcon={<EnvelopeClosedIcon className="w-5" />}>
              {/* @ts-ignore */}
              {t('buttonInquiry')}
            </Button>
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
