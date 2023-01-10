import { useTranslation } from '@/app/i18n'
import { fallbackLng, languages } from '@/app/i18n/settings'
import { Button } from '@/components/Elements/Button'
import Link from 'next/link'

export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string
  }
}) {
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = await useTranslation(lng, 'main')

  return (
    <div>
      <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
        <div className="mx-auto flex flex-col items-start gap-4 lg:w-[52rem]">
          <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
            Mapstories
          </h1>
          <p className="text-slate-700 sm:text-xl sm:leading-8">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button>{t('getStarted')}</Button>
          </Link>
          <Link href={'/about'}>
            <Button variant={'inverse'}>{t('infos')}</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
