import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import Image from 'next/image'
import VamosLogo from '@/assets/images/partners/logo_vamos.jpeg'
import ReeduLogo from '@/assets/images/partners/logo_reedu.svg'

export default function StoryTab() {
  const lng = useBoundStore(state => state.language)

  /* @ts-ignore */
  const { t } = useTranslation(lng, 'storyTab')
  return (
    <div className="flex flex-col gap-10 p-10">
      <div>
        {/* @ts-ignore */}
        <p>{t('text1')}</p>
        <p>{t('text2')}</p>
        <div>
          {' '}
          <a
            className="text-blue-500"
            href="https://old.mapstories.de/"
            target="_blank"
          >
            {' '}
            {t('here')}
          </a>
          {t('text3')}
        </div>
      </div>
      <h3>{t('textIntroDevelopers')}</h3>

      <div className="flex flex-row items-start gap-8">
        {/* @ts-ignore */}
        <div className="flex flex-1 flex-col items-center gap-4">
          <Image alt="Vamos logo" height={200} src={VamosLogo} width={200} />
          <div> {t('textVamosStart')}</div>
          <ul className="list-inside list-disc">
            <li>{t('textVamosList1')}</li>
            <li>{t('textVamosList2')}</li>
            <li>{t('textVamosList3')}</li>
          </ul>
          <div>{t('textVamosEnd')}</div>
        </div>
        <div className="flex flex-1 flex-col items-center gap-4">
          <Image alt="Reedu logo" height={200} src={ReeduLogo} width={200} />
          <p>{t('text_reedu')}</p>
        </div>
      </div>
    </div>
  )
}
