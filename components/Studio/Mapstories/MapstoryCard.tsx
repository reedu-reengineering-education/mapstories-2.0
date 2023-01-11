'use client'

import * as React from 'react'
import { Story } from '@prisma/client'

import { Card } from '@/components/Card'
import { Button } from '@/components/Elements/Button'
import Link from 'next/link'

type Props = {
  mapstory: Story
}

export function MapstoryCard({ mapstory }: Props) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{mapstory.name}</Card.Title>
      </Card.Header>
      <Card.Footer>
        <div className="flex gap-2">
          <Link href={`/studio/${mapstory.id}`}>
            <Button variant={'inverse'}>Bearbeiten</Button>
          </Link>
          <Link href={`/studio/${mapstory.id}`}>
            <Button>Spielen</Button>
          </Link>
        </div>
      </Card.Footer>
    </Card>
  )
}
