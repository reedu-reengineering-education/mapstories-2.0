import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { Card } from '@/src/components/Card'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/Elements/Card'
import Image from 'next/image'
import VamosLogo from '@/assets/images/partners/logo_vamos.jpeg'
import ReeduLogo from '@/assets/images/partners/logo_reedu.svg'

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
        <div className="flex flex-col">
          {/* Container für beide Partner */}
          <div className="flex max-h-[20rem] flex-row items-center overflow-hidden">
            <div className="flex basis-1/2 justify-center">
              <Image alt="Vamos Logo" objectFit="contain" src={VamosLogo} />
            </div>
            <div className="flex basis-1/2 justify-center">
              <Image
                alt="Reedu Logo"
                height={100}
                src={ReeduLogo}
                width={100}
              />
            </div>
          </div>
          <div className="flex flex-row items-center">
            <div className="basis-1/2 justify-center">
              {/* @ts-ignore */}
              <div className="mt-8 text-center">{t('textVamosStart')}</div>

              <ul className="mt-4 min-h-[150px] list-inside list-disc text-center">
                {/* @ts-ignore */}
                <li>{t('textVamosList1')}</li>
                {/* @ts-ignore */}

                <li>{t('textVamosList2')}</li>
                {/* @ts-ignore */}
                <li>{t('textVamosList3')}</li>
              </ul>
              {/* @ts-ignore */}
              <div className="mt-2 text-center">{t('textVamosEnd')}</div>
            </div>

            <div className="basis-1/2">
              {/* @ts-ignore */}
              <div className="min-h-[150px] text-center">{t('text_reedu')}</div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

// <div className="align-center flex flex-col content-center gap-8 lg:flex-row">
// {/* @ts-ignore */}
// <div className="flex flex-1 flex-col items-center gap-4">
//   <Image alt="Vamos logo" height={200} src={VamosLogo} width={200} />
//   {/* @ts-ignore */}

//   {/* @ts-ignore */}

// </div>
// <div className="flex flex-1 flex-col items-center gap-4">
//   <Image alt="Reedu logo" height={200} src={ReeduLogo} width={200} />
//   {/* @ts-ignore */}
// </div>
// </div>
