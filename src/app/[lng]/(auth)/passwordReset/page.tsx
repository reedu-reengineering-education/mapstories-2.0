import { useTranslation } from '@/src/app/i18n'
import UserResetPassword from '@/src/components/Auth/UserResetPassword'
import { Button } from '@/src/components/Elements/Button'
import { LogoWithClaimAndBackground } from '@/src/components/Layout/MapstoriesLogo'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default async function PasswordResetPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'login')
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link className="absolute left-4 top-4" href="/">
        <Button
          startIcon={<ChevronLeftIcon className="w-4" />}
          variant={'inverse'}
        >
          {t('back')}
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <LogoWithClaimAndBackground className="mx-auto h-32 w-60" />
          <h1 className="text-2xl font-bold">{t('welcome_back')}</h1>
          <p className="text-sm text-slate-600">{t('textPasswordReset')}</p>
        </div>
        <UserResetPassword />
      </div>
    </div>
  )
}
