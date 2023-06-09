import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import BMZLogo from '@/assets/images/partners/BMZ-Logo-4c.jpg'
import fachStelleWeltkirche from '@/assets/images/partners/Fachstelle Weltkirche - Logo.png'
import SUELogo from '@/assets/images/partners/SUE_Logo_CMYK_300dpi.jpg'
import Image from 'next/image'
import MapstoriesTitlePicture from '@/assets/images/mapstoriesTab.jpg'
export default function MapstoriesTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'mapstoriesTab')

  return (
    <div className="flex flex-col gap-10 p-10">
      <div className="align-center flex flex-col gap-10">
        <div className="justiven flex flex-row items-center gap-20">
          <div className="w-8/12">
            {/* @ts-ignore */}
            <div>{t('text1')}</div>

            <div>
              <span>{t('text2_1')}</span>{' '}
              <a className="text-blue-500" href={`/${lng}/gallery`}>
                {t('gallery')}
              </a>{' '}
              <span> {t('text2_2')}</span>
            </div>
            <br></br>
            <h3>{t('sponsoredBy')}</h3>
          </div>
          <div className="flex w-3/12 flex-col items-center gap-2">
            <Image alt="Workshop Foto" src={MapstoriesTitlePicture} />
            <span className="text-slate-600">{t('imageSubtitle')}</span>
          </div>
        </div>
        <div className="flex flex-row justify-evenly">
          {/* @ts-ignore */}
          <div className="flex flex-1 flex-col items-center gap-4 p-8">
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
            <div className="text-center">{t('supportBZM')}</div>
            <a
              className="transition duration-300 ease-in-out hover:scale-105"
              href="https://www.bmz.de/de"
            >
              <Image alt="BMZ Logo" src={BMZLogo} />
            </a>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4 border-l-2 border-zinc-300 p-8">
            <div>{t('supportedBy')}</div>
            <a
              className="transition duration-300 ease-in-out hover:scale-105"
              href="https://www.sue-nrw.de/"
            >
              <Image alt="SUE Logo" src={SUELogo} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
