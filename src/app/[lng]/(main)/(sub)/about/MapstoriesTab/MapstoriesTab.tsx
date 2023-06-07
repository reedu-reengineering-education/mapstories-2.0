import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import BMZLogo from '@/assets/images/partners/BMZ-Logo-4c.jpg'
import fachStelleWeltkirche from '@/assets/images/partners/Fachstelle Weltkirche - Logo.png'
import SUELogo from '@/assets/images/partners/SUE_Logo_CMYK_300dpi.jpg'
import Image from 'next/image'

export default function MapstoriesTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'mapstoriesTab')

  return (
    <div className="flex flex-col gap-10 p-10">
      <div className="align-center flex flex-col gap-10">
        <div>
          {/* @ts-ignore */}
          <div>{t('text1')}</div>
          <p>{t('text2')}</p>
          <br></br>
          <h3>{t('sponsoredBy')}</h3>
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
