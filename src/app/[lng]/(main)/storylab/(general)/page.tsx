import { useTranslation } from '@/src/app/i18n'
import { Button } from '@/src/components/Elements/Button'
import CreateMapstoryModal from '@/src/components/Studio/CreateMapstoryModal'
import { EmptyPlaceholder } from '@/src/components/Studio/EmptyPlaceholder'
import { StudioHeader } from '@/src/components/Studio/Header'
import { MapstoryCard } from '@/src/components/Studio/Mapstories/MapstoryCard'
import { TranslationCard } from '@/src/components/Studio/Mapstories/TranslationCard'
import { StudioShell } from '@/src/components/Studio/Shell'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { getCurrentSite } from '@/src/lib/site.server'
import { GlobeAltIcon, PlusIcon } from '@heroicons/react/24/outline'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'StoryLab',
  openGraph: {
    title: 'StoryLab',
  },
}

const getMapstories = async (userId: string) => {
  const site = getCurrentSite()
  return await db.story.findMany({
    where: {
      ownerId: userId,
      isTranslation: false,
      // BFDW only shows its own stories; MAIN shows everything so users can
      // still see/manage BFDW stories from the main site (marked on the card).
      ...(site === 'BFDW' ? { site } : {}),
    },
    include: {
      stepSuggestions: true,
      translationRequests: {
        where: { translationStatus: 'PENDING' },
        select: { id: true },
      },
      group: {
        include: {
          stories: {
            select: {
              language: true,
            },
          },
        },
      },
    },
  })
}

// Community translations the user is working on (drafts they own) or
// contributed to (approved translations now owned by the original author).
const getTranslations = async (userId: string) => {
  return await db.story.findMany({
    where: {
      isTranslation: true,
      OR: [
        // Unapproved drafts are owned by the translator. Once approved, the
        // author becomes owner, so only the translator (as contributor) sees it here.
        {
          ownerId: userId,
          translationStatus: { in: ['DRAFT', 'PENDING', 'REJECTED'] },
        },
        { contributor: { some: { id: userId } } },
      ],
    },
    select: {
      id: true,
      slug: true,
      name: true,
      language: true,
      ownerId: true,
      firstStepId: true,
      translationStatus: true,
      translationOf: {
        select: {
          name: true,
          language: true,
          author: true,
          owner: { select: { name: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
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
  const themes = await db.theme.findMany({})
  const translations = await getTranslations(user.id)

  return (
    <StudioShell>
      <StudioHeader
        heading="StoryLab"
        text={t('create, edit and share mapstories')}
      >
        <div className="p-1">
          <CreateMapstoryModal
            defaultAuthor={user.name}
            themes={themes}
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
            defaultAuthor={user.name}
            themes={themes}
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
      <div className='flex flex-col gap-2 '>
        {mapstories.length > 0 &&
          mapstories.map(m => (
            <MapstoryCard  data-superjson key={m.id} mapstory={m} />
          ))}
      </div>

      {translations.length > 0 && (
        <div className="mt-8 flex flex-col gap-2">
          <div>
            <h2 className="text-xl font-semibold">{t('myTranslations')}</h2>
            <p className="text-sm text-slate-600">
              {t('myTranslationsDescription')}
            </p>
          </div>
          {translations.map(translation => (
            <TranslationCard
              currentUserId={user.id}
              key={translation.id}
              translation={translation}
            />
          ))}
        </div>
      )}

    </StudioShell>
  )
}
