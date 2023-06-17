'use client'

import { useBoundStore } from '@/src/lib/store/store'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { Slide } from './Slide'
import useStory from '@/src/lib/api/story/useStory'

type Props = {
  slug: string
  page: string
}

export function Slides({ slug, page }: Props) {
  const router = useRouter()
  const path = usePathname()
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

  function nextStep() {
    // const length = story?.steps?.length
    if (path?.includes('mystories')) {
      router.push(`/mystories/story/${slug}/${page ? parseInt(page) + 1 : '1'}`)
    }
    router.push(`/gallery/story/${slug}/${page ? parseInt(page) + 1 : '1'}`)
  }

  function prevStep() {
    // const length = story?.steps?.length
    if (path?.includes('mystories')) {
      router.push(`/mystories/story/${slug}/${page ? parseInt(page) - 1 : '1'}`)
    }
    router.push(`/gallery/story/${slug}/${page ? parseInt(page) - 1 : '1'}`)
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
      {/* {page != 'start' && parseInt(page) + 1 < (story?.steps?.length ?? 0) && (
        <Button onClick={() => nextStep()}>Weiter</Button>
      )} */}
    </div>
  )
}
