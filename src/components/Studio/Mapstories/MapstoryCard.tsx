'use client'

import * as React from 'react'
import { Story } from '@prisma/client'

import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Elements/Button'
import Link from 'next/link'
import DeleteMapstoryButton from './DeleteMapstoryButton'
import { useTranslation } from '@/src/app/i18n/client'
import { useUIStore } from '@/src/lib/store/language'

type Props = {
  mapstory: Story
}

export function MapstoryCard({ mapstory }: Props) {
  const lng = useUIStore(state => state.language)
  const { t } = useTranslation(lng, 'mapstoryCard')

  return (
    <Card>
      <Card.Header>
        <Card.Title>{mapstory.name}</Card.Title>
      </Card.Header>
      <Card.Footer>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Link href={`/studio/${mapstory.slug}`}>
              <Button variant={'inverse'}>{t('edit')}</Button>
            </Link>
            <Link href={`/studio/${mapstory.slug}`}>
              <Button>{t('play')}</Button>
            </Link>
          </div>
          <DeleteMapstoryButton id={mapstory.id} />
        </div>
      </Card.Footer>
    </Card>
  )
}
