import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'

import Image from 'next/image'
import BMZLogo from '@/assets/images/partners/BMZ-Logo-4c.jpg'
import fachStelleWeltkirche from '@/assets/images/partners/Fachstelle Weltkirche - Logo.png'
import SUELogo from '@/assets/images/partners/SUE_Logo_CMYK_300dpi.jpg'
import VamosLogo from '@/assets/images/partners/logo_vamos.jpeg'
import ReeduLogo from '@/assets/images/partners/logo_reedu.svg'

export default function StoryTab() {
  const lng = useBoundStore(state => state.language)

  const { t } = useTranslation(lng, 'about')
  return (
    <div className="flex flex-col gap-10 p-10">
      <div>
        <p>{t('tab1_text')}</p>
      </div>
      <div className="flex flex-row items-center gap-10">
        <h3> {t('partners')} </h3>
        <div className="flex flex-col">
          <Image alt="BMZ Logo" height={200} src={BMZLogo} width={400} />
        </div>
        <div className="flex flex-col">
          <Image
            alt="Fachstelle Weltkirche Logo"
            height={400}
            src={fachStelleWeltkirche}
            width={300}
          />
        </div>
        <div className="flex flex-col">
          <Image alt="SUE Logo" height={300} src={SUELogo} width={400} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-evenly">
        <h3>{t('supportersAndDevelopers')}</h3>
        <div className="flex flex-col">
          <Image alt="Vamos logo" height={200} src={VamosLogo} width={200} />
        </div>
        <div className="flex flex-col">
          <Image alt="Reedu logo" height={200} src={ReeduLogo} width={200} />
        </div>
      </div>
    </div>
  )
}
