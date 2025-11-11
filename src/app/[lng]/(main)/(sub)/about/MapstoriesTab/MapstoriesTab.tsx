import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import BMZLogo from '@/assets/images/partners/BMZ-Logo-4c.jpg'
import fachStelleWeltkirche from '@/assets/images/partners/Fachstelle Weltkirche - Logo.png'
import SUELogo from '@/assets/images/partners/SUE_Logo_CMYK_300dpi.jpg'
import kunstNRW from '@/assets/images/partners/kunststiftung_nrw.png'
import kulturWissenschaftNRW from '@/assets/images/partners/kultur_wissenschaft_nrw.jpg'
import kulturamtBielefeld from '@/assets/images/partners/kulturamt-bielefeld_logo-scaled.png'
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
import './mapstoriesTab.css'

export default function MapstoriesTab() {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'mapstoriesTab')

  return (
    <Card className="overflow-scroll">
      <CardHeader>
        <CardTitle>Was sind Mapstories?</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between">
          <div className="lg:basis-3/4">
            <div>{t('text1')}</div>
            <span>{t('text2_1')}</span>{' '}
            <a className="text-blue-500" href={`/${lng}/gallery/all`}>
              {t('gallery')}
            </a>{' '}
            <span> {t('text2_2')}</span>
          </div>
          <div className="hidden basis-1/6 lg:flex lg:flex-col">
            <Image alt="Workshop Foto" src={MapstoriesTitlePicture} />
            <span className="text-center text-slate-600">
              {t('imageSubtitle')}
            </span>
          </div>
        </div>

        {/* --- EXISTIERENDE FÖRDERABSCHNITTE --- */}
        <div className="flex flex-col">
          <div className="flex flex-col lg:flex-row lg:justify-evenly">
            <div className="flex flex-1 flex-col items-center gap-4 p-8">
              <div className="hidden text-center lg:block">
                {t('supportedBy')}
              </div>
              <a
                className="flex justify-center align-baseline transition duration-300 ease-in-out hover:scale-105"
                href="https://www.bistum-muenster.de/weltkirche"
              >
                <Image
                  alt="Fachstelle Weltkirche Logo"
                  src={fachStelleWeltkirche}
                />
              </a>
            </div>
            <div className="my-2 flex flex-1 flex-col items-center gap-4 p-8 lg:border-l-2 lg:border-zinc-300">
              <div className="hidden text-center lg:block">
                {t('supportBZM')}
              </div>
              <a
                className="flex justify-center align-baseline transition duration-300 ease-in-out hover:scale-105"
                href="https://www.bmz.de/de"
              >
                <Image alt="BMZ Logo" src={BMZLogo} />
              </a>
            </div>
            <div className="my-2 flex flex-1 flex-col items-center gap-4 p-8 lg:border-l-2 lg:border-zinc-300">
              <div className="hidden text-center lg:block">
                {t('supportedBy')}
              </div>
              <a
                className="flex justify-center align-baseline transition duration-300 ease-in-out hover:scale-105"
                href="https://www.sue-nrw.de/"
              >
                <Image alt="SUE Logo" src={SUELogo} />
              </a>
            </div>
          </div>

          {/* --- ALTER ZEITGEISTY-FÖRDERABSCHNITT --- */}
          <div className="text-center mt-6">
            Gefördert durch das Ministerium für Kultur und Wissenschaft des
            Landes Nordrhein-Westfalen und die Kunststiftung NRW im Rahmen des
            Projektes ›zeitgeisty. be part of … Protestkulturen 1957-1967‹,
            getragen vom Bunker Ulmenwall e.V.
          </div>
          <div className="flex flex-col align-baseline lg:flex-row">
            <div className="flex flex-1 flex-col items-center gap-4 p-8">
              <a
                className="flex justify-center align-baseline transition duration-300 ease-in-out hover:scale-105"
                href="https://www.mkw.nrw"
              >
                <Image
                  alt="Kunst & Kultur NRW"
                  className="kulturWissenschaft"
                  src={kulturWissenschaftNRW}
                />
              </a>
            </div>
            <div className="my-2 flex flex-1 flex-col items-center gap-4 p-8 lg:border-l-2 lg:border-zinc-300">
              <a
                className="flex justify-center align-baseline transition duration-300 ease-in-out hover:scale-105"
                href="https://www.kunststiftungnrw.de/"
              >
                <Image alt="Kunststiftung NRW" src={kunstNRW} />
              </a>
            </div>
          </div>

          {/* --- NEUER ZEITGEISTY-FÖRDERABSCHNITT 2024 --- */}
          <div className="text-center mt-10">
            Gefördert durch das Ministerium für Kultur und Wissenschaft des
            Landes Nordrhein-Westfalen im Programm »Regionales Kultur Programm«,
            die Kunststiftung NRW und Stadt Bielefeld, Kulturamt im Rahmen des
            Projektes »zeitgeisty. be part of … Protestkulturen 1968-1978«,
            getragen vom Bunker Ulmenwall e.V. und Kulturgut Havixbeck e.V.
          </div>

          <div className="flex flex-col align-baseline lg:flex-row lg:justify-evenly">
            <div className="flex flex-1 flex-col items-center gap-4 p-8">
              <Image
                alt="Kultur und Wissenschaft NRW"
                src={kulturWissenschaftNRW}
              />
            </div>
            <div className="my-2 flex flex-1 flex-col items-center gap-4 p-8 lg:border-l-2 lg:border-zinc-300">
              <Image alt="Kunststiftung NRW" src={kunstNRW} />
            </div>
            <div className="my-2 flex flex-1 flex-col items-center gap-4 p-8 lg:border-l-2 lg:border-zinc-300">
              <Image
                alt="Kulturamt Bielefeld"
                src={kulturamtBielefeld}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
