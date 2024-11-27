import { useTranslation } from '@/src/app/i18n'
import UserAuthRequestPassword from '@/src/components/Auth/UserAuthRequestPassword'
import { LogoWithClaimAndBackground } from '@/src/components/Layout/MapstoriesLogo'
import React from 'react'

export default async function RequestPasswordPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'login')

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <LogoWithClaimAndBackground className="mx-auto h-32 w-60" />
          <h1 className="text-2xl font-bold">{t('welcome_back')}</h1>
          <p className="text-sm text-slate-600">
            {t('enter_email_for_password_request')}
          </p>
        </div>
        <UserAuthRequestPassword />
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
