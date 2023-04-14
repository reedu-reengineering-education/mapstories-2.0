'use client'

import { Button } from '@/src/components/Elements/Button'
import useStory from '@/src/lib/api/story/useStory'
import { useBoundStore } from '@/src/lib/store/store'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { Slide } from './Slide'

type Props = {
  slug: string
  page: string
}

export function StoryOverviewControls({ slug, page }: Props) {
  const router = useRouter()
  const setStoryID = useBoundStore(state => state.setStoryID)
  const { story } = useStory(slug)

  const updateSelectedStepIndex = useBoundStore(
    state => state.updateSelectedStepIndex,
  )

  useEffect(() => {
    if (story) {
      setStoryID(story.id)
    } else {
      setStoryID('')
    }
  }, [story])

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
  }, [page])

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
  }, [])

  function startStory() {
    router.push(`/viewer/story/${slug}/0`)
  }

  return (
    <div className="py-4">
      <div className="bg-gray">
        <h1>{story?.name}</h1>
      </div>
      {page == 'start' && (
        <>
          <Slide step={story?.firstStep}></Slide>

          <Button onClick={() => startStory()}>Abspielen</Button>

          <div>
            <Button onClick={() => router.push('viewer')}>Abbrechen</Button>
          </div>
        </>
      )}
      {page != 'start' && (
        <>
          <div>
            Schritt {parseInt(page) + 1}/{story?.steps?.length}
          </div>
        </>
      )}
    </div>
  )
}
