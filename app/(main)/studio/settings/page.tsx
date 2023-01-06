import { StudioHeader } from '@/components/Studio/Header'
import { UserSettingsForm } from '@/components/Studio/Settings/UserSettingsForm'
import { StudioShell } from '@/components/Studio/Shell'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  return (
    <StudioShell>
      <StudioHeader
        heading="Einstellungen"
        text="Bearbeite deinen Account"
      ></StudioHeader>
      <UserSettingsForm user={user} />
    </StudioShell>
  )
}
