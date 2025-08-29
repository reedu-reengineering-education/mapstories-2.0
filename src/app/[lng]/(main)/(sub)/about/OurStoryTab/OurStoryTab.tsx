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

  /* @ts-expect-error */
  const { t } = useTranslation(lng, 'storyTab')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('text1')} </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p>{t('text2')}</p>
          <div>
            {' '}
              <a
              className="text-blue-500"
              href="https://old.mapstories.de/"
              target="_blank"
            >
                  {t('here')}
            </a>
              {t('text3')}
          </div>
          <br></br>
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
                  <div className="mt-8 text-center">{t('textVamosStart')}</div>

              <ul className="mt-4 min-h-[150px] list-inside list-disc text-center">
                      <li>{t('textVamosList1')}</li>
      
                <li>{t('textVamosList2')}</li>
                      <li>{t('textVamosList3')}</li>
              </ul>
                  <div className="mt-2 text-center">{t('textVamosEnd')}</div>
            </div>

            <div className="basis-1/2">
                  <div className="min-h-[150px] text-center">{t('text_reedu')}</div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

