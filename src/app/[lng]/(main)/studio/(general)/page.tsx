import { useTranslation } from '@/src/app/i18n'
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

export default async function Studio({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const user = await getCurrentUser()
  const { t } = await useTranslation(lng, 'studio')
  if (!user) {
    redirect('/')
  }

  const mapstories = await getMapstories(user.id)

  return (
    <StudioShell>
      <StudioHeader
        heading="Studio"
        text={t('create, edit and share mapstories')}
      >
        <div className="p-1">
          <CreateMapstoryModal
            lng={lng}
            trigger={
              <Button startIcon={<PlusIcon className="w-4" />}>
                {t('newMapstory')}
              </Button>
            }
          />
        </div>
      </StudioHeader>
      {mapstories.length === 0 && (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon icon={GlobeAltIcon} />
          <EmptyPlaceholder.Title>{t('no mapstories')}</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {t('you have not created any mapstories yet.')}
          </EmptyPlaceholder.Description>
          <CreateMapstoryModal
            lng={lng}
            trigger={
              <Button
                startIcon={<PlusIcon className="w-4" />}
                variant={'inverse'}
              >
                {t('newMapstory')}
              </Button>
            }
          />
        </EmptyPlaceholder>
      )}
      {mapstories.length > 0 &&
        mapstories.map(m => (
          <MapstoryCard data-superjson key={m.id} lng={lng} mapstory={m} />
        ))}
    </StudioShell>
  )
}
