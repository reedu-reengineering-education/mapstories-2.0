'use client'

import { Button } from '@/src/components/Elements/Button'
import useStory from '@/src/lib/api/story/useStory'
import { useBoundStore } from '@/src/lib/store/store'
// import { useStoryStore } from '@/src/lib/store/story'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { Slide } from './Slide'

type Props = {
  slug: string
  page: string
}

export function Slides({ slug, page }: Props) {
  const router = useRouter()
  const setStoryID = useBoundStore(state => state.setStoryID)
  const { story } = useStory(slug)

  const updateSelectedStepIndex = useBoundStore(
    state => state.updateSelectedStepIndex,
  )
  const selectedStepIndex = useBoundStore(state => state.selectedStepIndex)

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
  function nextStep() {
    // const length = story?.steps?.length
    router.push(`/viewer/story/${slug}/${page ? parseInt(page) + 1 : '1'}`)
  }

  function prevStep() {
    // const length = story?.steps?.length
    router.push(`/viewer/story/${slug}/${page ? parseInt(page) - 1 : '1'}`)
  }

  return (
    <div className="py-4">
      {story?.steps && page && (
        <Slide
          step={
            page == 'start' ? story?.firstStep : story?.steps[parseInt(page)]
          }
        ></Slide>
      )}

      {page === 'start' && (
        <Button onClick={() => startStory()}>Abspielen</Button>
      )}

      {page != 'start' && <Button onClick={() => nextStep()}>Weiter</Button>}

      {parseInt(page) > 0 && <Button onClick={() => prevStep()}>Zurück</Button>}

      <div>
        <Button onClick={() => router.push('viewer')}>Abbrechen</Button>
      </div>
    </div>
  )
}
