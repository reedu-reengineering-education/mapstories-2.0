'use client'

import DrawControl from '@/components/Map/DrawControl'
import { Story } from '@prisma/client'
import { StudioHeader } from '../Header'
import { StudioShell } from '../Shell'
import Map from '@/components/Map'
import { useStoryStore } from '@/lib/store/story'
import { useEffect } from 'react'

type EditMapstoryViewProps = {
  story: Story
}

export default function EditMapstoryView({ story }: EditMapstoryViewProps) {
  const updateStory = useStoryStore(state => state.updateStory)

  useEffect(() => {
    updateStory(story)
  }, [])

  return (
    <StudioShell>
      <StudioHeader heading={story.name || ''} text={story.id} />
      <div className="relative h-96 w-full overflow-hidden rounded-lg shadow">
        <Map>
          <DrawControl
            controls={{
              polygon: true,
              point: true,
              trash: true,
            }}
            displayControlsDefault={false}
            position="top-left"
          />
        </Map>
      </div>
    </StudioShell>
  )
}
