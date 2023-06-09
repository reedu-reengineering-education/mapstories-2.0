import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import Image from 'next/image'
import VamosLogo from '@/assets/images/partners/logo_vamos.jpeg'
import ReeduLogo from '@/assets/images/partners/logo_reedu.svg'

export default function OurStoryTab() {
  const lng = useBoundStore(state => state.language)

  /* @ts-ignore */
  const { t } = useTranslation(lng, 'storyTab')
  return (
    <div className="flex flex-col gap-10 p-10">
      <div>
        {/* @ts-ignore */}
        <p>{t('text1')}</p>
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
            {' '}
            {/* @ts-ignore */}
            {t('here')}
          </a>
          {/* @ts-ignore */}
          {t('text3')}
        </div>
      </div>
      {/* @ts-ignore */}

      <h3>{t('textIntroDevelopers')}</h3>

      <div className="flex flex-row items-start gap-8">
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
    </div>
  )
}
