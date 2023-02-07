import { Button } from '@/src/components/Elements/Button'
import CreateMapstoryModal from '@/src/components/Studio/CreateMapstoryModal'
import { EmptyPlaceholder } from '@/src/components/Studio/EmptyPlaceholder'
import { StudioHeader } from '@/src/components/Studio/Header'
import { MapstoryCard } from '@/src/components/Studio/Mapstories/MapstoryCard'
import { StudioShell } from '@/src/components/Studio/Shell'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { GlobeAltIcon, PlusIcon } from '@heroicons/react/24/outline'
import { redirect } from 'next/navigation'

const getMapstories = async (userId: string) => {
  return await db.story.findMany({
    where: {
      ownerId: userId,
    },
  })
}

export default async function Studio() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  const mapstories = await getMapstories(user.id)

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
      {mapstories.length === 0 && (
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
      )}
      {mapstories.length > 0 &&
        mapstories.map(m => (
          <MapstoryCard data-superjson key={m.id} mapstory={m} />
        ))}
    </StudioShell>
  )
}