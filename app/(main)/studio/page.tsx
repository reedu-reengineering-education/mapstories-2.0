import { Button } from '@/components/Elements/Button'
import { EmptyPlaceholder } from '@/components/Studio/EmptyPlaceholder'
import { StudioHeader } from '@/components/Studio/Header'
import { StudioShell } from '@/components/Studio/Shell'
import { GlobeAltIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function Studio() {
  return (
    <StudioShell>
      <StudioHeader
        heading="Mapstories Studio"
        text="Erstelle und bearbeite deine Mapstories"
      >
        <div className="p-1">
          <Button startIcon={<PlusIcon className="w-4" />}>
            Neue Mapstory
          </Button>
        </div>
      </StudioHeader>
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon icon={GlobeAltIcon} />
        <EmptyPlaceholder.Title>Keine Mapstories</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Du hast noch keine Mapstory erstellt.
        </EmptyPlaceholder.Description>
        <Button startIcon={<PlusIcon className="w-4" />}>Neue Mapstory</Button>
      </EmptyPlaceholder>
    </StudioShell>
  )
}
