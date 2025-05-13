import Link from 'next/link'

import { Button } from '@/src/components/Elements/Button'
import { UserAuthForm } from '@/src/components/Auth/UserAuthForm'
import { LogoWithClaimAndBackground } from '@/src/components/Layout/MapstoriesLogo'
import { useTranslation } from '@/src/app/i18n'

export default async function RegisterPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'login')

  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link className="absolute right-4 top-4" href="/login">
        <Button variant={'inverse'}>Login</Button>
      </Link>
      <div className="hidden h-full bg-slate-100 lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <LogoWithClaimAndBackground className="mx-auto h-32 w-60" />
            <h1 className="text-2xl font-bold">{t('createAccountTitle')}</h1>
            <p className="text-sm text-slate-600">{t('createAccountText')}</p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-slate-600">
            {t('acceptTOS')}{' '}
            <Link className="hover:text-brand underline" href="/terms">
              {t('TOS')}
            </Link>{' '}
            {t('and')}{' '}
            <Link className="hover:text-brand underline" href="/privacy">
              {t('PP')}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
