import { useTranslation } from '@/src/app/i18n'
import { PageHeader } from '@/src/components/PageHeader'
import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Feedback',
  openGraph: {
    title: 'Feedback',
  },
}

export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng, 'feedback')

  return (
    <div>
      <PageHeader heading={t('feedbackTitle') as string}></PageHeader>
      <p className="py-4">
        <a
          className="text-blue-500"
          href="https://padlet.com/VamosMuenster/feedback-zur-plattform-mapstories-vxeo28o2lzldiwuy"
          target="_blank"
        >
          {t('here')}
        </a>
        {t('feedbackVamosText')}
      </p>
      <p className="py-4">
        <a
          className="text-blue-500"
          href="https://github.com/reedu-reengineering-education/mapstories-2.0"
          target="_blank"
        >
          {t('here')}
        </a>
        {t('feedbackReeduText')}
      </p>
    </div>
  )
}
