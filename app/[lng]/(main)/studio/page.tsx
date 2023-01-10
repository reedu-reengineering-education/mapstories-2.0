import { Button } from '@/components/Elements/Button'
import CreateMapstoryModal from '@/components/Studio/CreateMapstoryModal'
import { EmptyPlaceholder } from '@/components/Studio/EmptyPlaceholder'
import { StudioHeader } from '@/components/Studio/Header'
import { StudioShell } from '@/components/Studio/Shell'
import { GlobeAltIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function Studio() {
  return (
    <StudioShell>
      <StudioHeader
        heading="Studio"
        text="Mapstories erstellen, bearbeiten und teilen"
      >
        <div className="p-1">
          <CreateMapstoryModal
            trigger={
              <Button startIcon={<PlusIcon className="w-4" />}>
                Neue Mapstory
              </Button>
            }
          />
        </div>
      </StudioHeader>
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon icon={GlobeAltIcon} />
        <EmptyPlaceholder.Title>Keine Mapstories</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Du hast noch keine Mapstory erstellt.
        </EmptyPlaceholder.Description>
        <CreateMapstoryModal
          trigger={
            <Button
              startIcon={<PlusIcon className="w-4" />}
              variant={'inverse'}
            >
              Neue Mapstory
            </Button>
          }
        />
      </EmptyPlaceholder>
    </StudioShell>
  )
}
