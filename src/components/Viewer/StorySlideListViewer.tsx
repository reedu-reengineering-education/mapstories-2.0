'use client'

import useStory from '@/src/lib/api/story/useStory'
import { useBoundStore } from '@/src/lib/store/store'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'

type Props = {
  slug: string
  page: string
}

export function StorySlideListViewer({ slug, page }: Props) {
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
      <ul>
        {story?.steps?.map(step => {
          //   return <div key={step.position}>Side {step.position}</div>
          return (
            <div className="my-2 h-12 w-20 bg-white py-4" key={step.position}>
              {/* {getSlideTitle(step.content)} */}
            </div>
          )
        })}
        <li></li>
      </ul>
    </div>
  )
}
