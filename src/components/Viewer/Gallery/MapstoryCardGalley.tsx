'use client'

import * as React from 'react'
import { SlideContent, Story, StoryStep } from '@prisma/client'

import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Elements/Button'
import Link from 'next/link'
import { useTranslation } from '@/src/app/i18n/client'
// import { useUIStore } from '@/src/lib/store/ui'
import { useBoundStore } from '@/src/lib/store/store'
import { StoryBadge } from '../../Studio/Mapstories/StoryBadge'

type Props = {
  mapstory: Story & {
    steps: (StoryStep & { content: SlideContent[] })[]
  }
}

export function MapstoryCardGallery({ mapstory }: Props) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'mapstoryCard')
  const setViewerStories = useBoundStore(state => state.setViewerStories)
  const setStoryID = useBoundStore(state => state.setStoryID)

  const selectStoryForViewer = function (
    mapstory: Story & {
      steps: (StoryStep & { content: SlideContent[] })[]
    },
  ) {
    setViewerStories([mapstory])
  }
  return (
    <Card className="my-2">
      <Card.Header>
        <StoryBadge mode={mapstory.mode} />
        <Card.Title>{mapstory.name}</Card.Title>
      </Card.Header>
      <Card.Content>{mapstory.description}</Card.Content>
      <Card.Footer>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Link href={`/gallery/all/story/${mapstory.slug}/start`}>
              <Button onClick={() => selectStoryForViewer(mapstory)}>
                {t('play')}
              </Button>
            </Link>
          </div>
        </div>
      </Card.Footer>
    </Card>
  )
}
