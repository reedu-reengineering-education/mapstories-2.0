import { useTranslation } from '@/app/i18n'
import { fallbackLng, languages } from '@/app/i18n/settings'
import { Button } from '@/components/Elements/Button'
import { PageHeader } from '@/components/PageHeader'
import Image from 'next/image'
import Link from 'next/link'
import HeaderImg from '@/assets/images/undraw_adventure_re_ncqp.svg'
import { Spacer } from '@/components/Elements/Spacer'

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
    <>
      <div className="relative py-4 md:py-12">
        <div className="absolute top-0 left-0 -z-10 -my-6 h-full w-full bg-gradient-to-r from-white via-slate-50 to-white" />
        <div className="flex flex-col items-center justify-around gap-2 md:flex-row md:gap-6">
          <div className="md:max-w-[12rem]">
            <PageHeader heading="Mapstories" text={t('subtitle')}></PageHeader>
            <Spacer />
          </div>

          <div className="relative hidden sm:block md:h-64 md:w-64 lg:h-96 lg:w-96">
            <Image
              alt="Mapstories header imgage"
              className="relative object-contain"
              fill
              src={HeaderImg}
            />
          </div>
        </div>

        <div className="my-12 flex w-full items-center justify-center gap-4">
          <Link href="/login">
            <Button>{t('getStarted')}</Button>
          </Link>
          <Link href={'/about'}>
            <Button variant={'inverse'}>{t('infos')}</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
