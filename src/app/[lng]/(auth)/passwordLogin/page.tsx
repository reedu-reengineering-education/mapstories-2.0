import Link from 'next/link'

import { Button } from '@/src/components/Elements/Button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/src/app/i18n'
import { LogoWithClaimAndBackground } from '@/src/components/Layout/MapstoriesLogo'
import UserAuthPassword from '@/src/components/Auth/UserAuthPassword'

export default async function LoginPage({
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
          <p className="text-sm text-slate-600">
            {t('enter_email_and_password_for_signin')}
          </p>
          <p className="textz-sm text-slate-800">
            {t('enable_password_login')}
            <a className="text-blue-500" href="/passwordRequest">
              {t('link')}
            </a>
            {t('enable_password_login_end')}
          </p>
        </div>
        <UserAuthPassword />
        {/* <h1 className="text-center">Noch keinen Account?</h1>
        <p className="px-8 text-center text-sm text-slate-600">
          {t('disclaimerRegister')}{' '}
          <Link className="hover:text-brand underline" href="/terms">
            {t('TOS')}
          </Link>{' '}
          {t('and')}{' '}
          <Link className="hover:text-brand underline" href="/privacy">
            {t('PP')}
          </Link>
        </p> */}
      </div>
    </div>
  )
}
