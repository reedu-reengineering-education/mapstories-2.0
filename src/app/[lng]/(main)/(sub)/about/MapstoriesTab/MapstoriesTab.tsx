import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import BMZLogo from '@/assets/images/partners/BMZ-Logo-4c.jpg'
import fachStelleWeltkirche from '@/assets/images/partners/Fachstelle Weltkirche - Logo.png'
import SUELogo from '@/assets/images/partners/SUE_Logo_CMYK_300dpi.jpg'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/Elements/Card'
import MapstoriesTitlePicture from '@/assets/images/mapstoriesTab.jpg'

export default function MapstoriesTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'mapstoriesTab')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Was sind Mapstories?</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between">
          <div className="basis-3/4">
            <div>{t('text1')}</div>
            <span>{t('text2_1')}</span>{' '}
            <a className="text-blue-500" href={`/${lng}/gallery/all`}>
              {/* @ts-ignore */}
              {t('gallery')}
            </a>{' '}
            {/* @ts-ignore */}
            <span> {t('text2_2')}</span>
          </div>
          <div className="basis-2/6">
            <Image alt="Workshop Foto" src={MapstoriesTitlePicture} />
            <span className="text-center text-slate-600">
              {/* @ts-ignore */}

              {t('imageSubtitle')}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row justify-evenly">
          {/* @ts-ignore */}
          <div className="flex flex-1 flex-col items-center gap-4 p-8">
            {/* @ts-ignore */}
            <div>{t('supportedBy')}</div>
            <a
              className="transition duration-300 ease-in-out hover:scale-105"
              href="https://www.bistum-muenster.de/weltkirche"
            >
              <Image
                alt="Fachstelle Weltkirche Logo"
                src={fachStelleWeltkirche}
              />
            </a>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4 border-l-2 border-zinc-300 p-8">
            {/* @ts-ignore */}
            <div className="text-center">{t('supportBZM')}</div>
            <a
              className="transition duration-300 ease-in-out hover:scale-105"
              href="https://www.bmz.de/de"
            >
              <Image alt="BMZ Logo" src={BMZLogo} />
            </a>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4 border-l-2 border-zinc-300 p-8">
            {/* @ts-ignore */}
            <div>{t('supportedBy')}</div>
            <a
              className="transition duration-300 ease-in-out hover:scale-105"
              href="https://www.sue-nrw.de/"
            >
              <Image alt="SUE Logo" src={SUELogo} />
            </a>
          </div>
        </div>{' '}
      </CardFooter>
    </Card>
  )
}
