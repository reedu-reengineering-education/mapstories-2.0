import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import Image from 'next/image'
import VamosLogo from '@/assets/images/partners/logo_vamos.jpeg'
import ReeduLogo from '@/assets/images/partners/logo_reedu.svg'
import { Card } from '@/src/components/Card'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/Elements/Card'

export default function OurStoryTab() {
  const lng = useBoundStore(state => state.language)

  /* @ts-ignore */
  const { t } = useTranslation(lng, 'storyTab')
  return (
    <Card>
      <CardHeader>
        {/* @ts-ignore */}
        <CardTitle>{t('title')}</CardTitle>
        {/* @ts-ignore */}
        <CardDescription>{t('text1')} </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {/* @ts-ignore */}
          <p>{t('text2')}</p>
          {/* @ts-ignore */}
          <div>
            {' '}
            {/* @ts-ignore */}
            <a
              className="text-blue-500"
              href="https://old.mapstories.de/"
              target="_blank"
            >
              {/* @ts-ignore */}
              {t('here')}
            </a>
            {/* @ts-ignore */}
            {t('text3')}
          </div>
          <br></br>
          {/* @ts-ignore */}
          <h3>{t('textIntroDevelopers')}</h3>
        </div>
      </CardContent>
      <CardFooter>
        <div className="align-center flex flex-col content-center gap-8 lg:flex-row">
          {/* @ts-ignore */}
          <div className="flex flex-1 flex-col items-center gap-4">
            <Image alt="Vamos logo" height={200} src={VamosLogo} width={200} />
            {/* @ts-ignore */}

            <div> {t('textVamosStart')}</div>
            <ul className="list-inside list-disc">
              {/* @ts-ignore */}

              <li>{t('textVamosList1')}</li>
              {/* @ts-ignore */}

              <li>{t('textVamosList2')}</li>
              {/* @ts-ignore */}

              <li>{t('textVamosList3')}</li>
            </ul>
            {/* @ts-ignore */}

            <div>{t('textVamosEnd')}</div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4">
            <Image alt="Reedu logo" height={200} src={ReeduLogo} width={200} />
            {/* @ts-ignore */}
            <p>{t('text_reedu')}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
