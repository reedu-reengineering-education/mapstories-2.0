import Link from 'next/link'
import { Button } from '@/src/components/Elements/Button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/src/app/i18n'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { ConfirmEmail } from '@/src/components/Auth/ConfirmEmail'

export default async function ConfirmEmailPage({
  params: { lng },
  searchParams,
}: {
  params: { lng: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { t } = await useTranslation(lng, 'login')
  const session = await getServerSession(authOptions)

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
      <ConfirmEmail
        token={searchParams.token}
        user={session?.user}
      ></ConfirmEmail>
    </div>
  )
}
