import { StudioHeader } from '@/src/components/Studio/Header'
import { UserSettingsForm } from '@/src/components/Studio/Settings/UserSettingsForm'
import { StudioShell } from '@/src/components/Studio/Shell'
import { getCurrentUser } from '@/src/lib/session'
import { redirect } from 'next/navigation'
import { useTranslation } from '@/src/app/i18n'

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
      {/* @ts-expect-error */}
      <UserSettingsForm user={user} />
    </StudioShell>
  )
}
