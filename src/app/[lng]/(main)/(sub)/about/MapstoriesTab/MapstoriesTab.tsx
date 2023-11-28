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
          <div className="lg:basis-3/4">
            {/* @ts-ignore */}
            <div>{t('text1')}</div>
            {/* @ts-ignore */}
            <span>{t('text2_1')}</span>{' '}
            <a className="text-blue-500" href={`/${lng}/gallery/all`}>
              {/* @ts-ignore */}
              {t('gallery')}
            </a>{' '}
            {/* @ts-ignore */}
            <span> {t('text2_2')}</span>
          </div>
          <div className="hidden basis-1/6 lg:flex lg:flex-col">
            <Image alt="Workshop Foto" src={MapstoriesTitlePicture} />
            <span className="text-center text-slate-600">
              {/* @ts-ignore */}

              {t('imageSubtitle')}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col lg:basis-3/4 lg:flex-row lg:justify-evenly">
          {/* @ts-ignore */}
          <div className="flex flex-1 flex-col items-center gap-4 p-8">
            {/* @ts-ignore */}
            <div className="hidden text-center lg:block">
              {/* @ts-ignore */}
              {t('supportedBy')}
            </div>
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
          <div className="flex flex-1 flex-col items-center gap-4 p-8 lg:border-l-2 lg:border-zinc-300">
            {/* @ts-ignore */}
            <div className="hidden text-center lg:block">{t('supportBZM')}</div>
            <a
              className="transition duration-300 ease-in-out hover:scale-105"
              href="https://www.bmz.de/de"
            >
              <Image alt="BMZ Logo" src={BMZLogo} />
            </a>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4 p-8 lg:border-l-2 lg:border-zinc-300">
            {/* @ts-ignore */}
            <div className="hidden text-center lg:block">
              {t('supportedBy')}
            </div>
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
