'use client'

import { useEffect } from 'react'
import { LogoWithClaimAndBackground } from '../Layout/MapstoriesLogo'
import { signOut } from 'next-auth/react'
import { toast } from '@/src/lib/toast'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'

export function ConfirmEmail({ user, token }: any) {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'changeEmail')

  let running = false
  async function confirmChange(token: string) {
    if (!running) {
      running = true
      const res = await fetch('/api/users/confirmNewEmail?token=' + token, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        toast({
          title: t('success'),
          //@ts-ignore
          message: t('login_new_mail'),
          type: 'success',
        })

        setTimeout(() => {
          signOut({ callbackUrl: '/login' })
        }, 600)
      } else {
        toast({
          //@ts-ignore
          title: t('error'),
          //@ts-ignore
          message: t('invalid_email_change'),
          type: 'error',
        })
      }
    }
  }

  useEffect(() => {
    confirmChange(token)
  }, [])

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <LogoWithClaimAndBackground className="mx-auto h-32 w-60" />
        {/* @ts-ignore */}
        <h1 className="text-2xl font-bold">{t('verify_new_email')}</h1>
        {/* @ts-ignore */}
        <p className="text-sm text-slate-600">{t('validating')}</p>
      </div>
    </div>
  )
}
