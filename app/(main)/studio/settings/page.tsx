import { StudioHeader } from '@/components/Studio/Header'
import { StudioShell } from '@/components/Studio/Shell'

export default function SettingsPage() {
  return (
    <StudioShell>
      <StudioHeader
        heading="Einstellungen"
        text="Bearbeite deinen Account"
      ></StudioHeader>
    </StudioShell>
  )
}
