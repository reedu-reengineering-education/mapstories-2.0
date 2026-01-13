import { StudioHeader } from '@/src/components/Studio/Header'
import { StudioShell } from '@/src/components/Studio/Shell'
import { getCurrentUser } from '@/src/lib/session'
import { redirect } from 'next/navigation'
import { useTranslation } from '@/src/app/i18n'
import UserCookieConsentForm from '@/src/components/Studio/Settings/UserCookieConsentForm'

export default async function SettingsPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const user = await getCurrentUser()
  const { t } = await useTranslation(lng, 'settings')

  if (!user) {
    redirect('/')
  }

  return (
    <StudioShell>
      <StudioHeader
        heading={t('settings')}
        text={t('edit your account')}
      ></StudioHeader>
      <UserCookieConsentForm  />
    </StudioShell>
  )
}
