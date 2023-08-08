'use client'

import * as React from 'react'
import { Story } from '@prisma/client'

import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Elements/Button'
import Link from 'next/link'
import DeleteMapstoryButton from './DeleteMapstoryButton'
import { useTranslation } from '@/src/app/i18n/client'
// import { useUIStore } from '@/src/lib/store/ui'
import { useBoundStore } from '@/src/lib/store/store'
import ShareModal from './ShareModal'
import EmbedModal from './EmbedModal'
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import SettingsModal from './SettingsModal'

type Props = {
  mapstory: Story
}

export function MapstoryCard({ mapstory }: Props) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'mapstoryCard')

  return (
    <Card>
      <Card.Header>
        <Card.Title>{mapstory.name}</Card.Title>
      </Card.Header>
      <Card.Footer>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Link href={`/mystories/story/${mapstory.slug}/start`}>
              <Button startIcon={<EyeIcon className="w-5" />}>
                {t('play')}
              </Button>
            </Link>
            <Link href={`/storylab/${mapstory.slug}`}>
              <Button
                startIcon={<PencilIcon className="w-5" />}
                variant={'inverse'}
              >
                {t('edit')}
              </Button>
            </Link>
            <SettingsModal storyId={mapstory.id} />
            <ShareModal storyId={mapstory.id} />
            <EmbedModal storyId={mapstory.id} />
          </div>
          <DeleteMapstoryButton id={mapstory.id} />
        </div>
      </Card.Footer>
    </Card>
  )
}
