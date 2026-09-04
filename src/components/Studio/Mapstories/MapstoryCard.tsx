'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
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
import { StoryBadge } from './StoryBadge'
import CopyModal from './CopyModal'
import Image from 'next/image'
import bfdwLogo from '@/assets/images/logo/bfdw-connect-logo.png'
import { Tooltip } from '@/src/components/Tooltip'

const BFDW_DOMAIN = process.env.NEXT_PUBLIC_BFDW_DOMAIN

// Links for a BFDW story must point back at the BFDW subdomain, even when
// the card is rendered on the main site (which shows stories from both sites).
function useCrossSiteHref(site: Story['site']) {
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (
      site === 'BFDW' &&
      BFDW_DOMAIN &&
      window.location.hostname !== BFDW_DOMAIN
    ) {
      const port = window.location.port ? `:${window.location.port}` : ''
      setOrigin(`${window.location.protocol}//${BFDW_DOMAIN}${port}`)
    }
  }, [site])

  return (path: string) => `${origin}${path}`
}

type Props = {
  mapstory: Story
}

export function MapstoryCard({ mapstory }: Props) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'mapstoryCard')
  const href = useCrossSiteHref(mapstory.site)
  
  return (
    <Card className=''>
      <Card.Header>

        {mapstory.mode === 'TIMELINE' && <StoryBadge mode={mapstory.mode} />}
        <Card.Title className="flex justify-between items-center gap-2">
          
          {mapstory.name}
                  {mapstory.site === 'BFDW' && (
            <Tooltip content="Diese Mapstory stammt von der Brot für die Welt-Subdomain">
              <Image alt="BFDW" className="h-12 w-auto object-contain" src={bfdwLogo} />
            </Tooltip>
        )}
          </Card.Title>
        
      </Card.Header>
      <Card.Footer>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Link href={href(`/mystories/all/story/${mapstory.slug}/start`)}>
              <Button startIcon={<EyeIcon className="w-5" />}>
                {t('play')}
              </Button>
            </Link>
            <Link href={href(`/storylab/${mapstory.slug}`)}>
              <Button
                startIcon={<PencilIcon className="w-5" />}
                variant={'inverse'}
              >
                {t('edit')}
              </Button>
            </Link>
            {/* <SettingsModal storyId={mapstory.id} /> */}
            <CopyModal storyId={mapstory.id} storyName={mapstory.name} />
            <ShareModal storyId={mapstory.id} />
            <EmbedModal storyId={mapstory.slug} />
            {(mapstory as any).stepSuggestions.length > 0 && (
              <Link href={`/storylab/stepSuggestions/${mapstory.id}`}>
                <Button startIcon={<PencilIcon className="w-5" />}>
                  {/* @ts-expect-error */}
                  Offene Vorschläge ({mapstory.stepSuggestions.length})
                </Button>
              </Link>
            )}
          </div>
          
          <DeleteMapstoryButton id={mapstory.id} />
        </div>
      </Card.Footer>
    </Card>
  )
}
