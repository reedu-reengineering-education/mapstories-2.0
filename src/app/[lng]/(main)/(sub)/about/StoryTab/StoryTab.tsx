import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'

import Image from 'next/image'
import BMZLogo from '@/assets/images/partners/BMZ-Logo-4c.jpg'
import fachStelleWeltkirche from '@/assets/images/partners/Fachstelle Weltkirche - Logo.png'
import SUELogo from '@/assets/images/partners/SUE_Logo_CMYK_300dpi.jpg'

export default function StoryTab() {
  const lng = useBoundStore(state => state.language)

  /* @ts-ignore */
  const { t } = useTranslation(lng, 'about')
  return (
    <div className="flex flex-col gap-10 p-10">
      <div>
        {/* @ts-ignore */}
        <p>{t('tab1_text')}</p>
      </div>
      <div className="flex flex-row items-center gap-10">
        {/* @ts-ignore */}
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
    </div>
  )
}
