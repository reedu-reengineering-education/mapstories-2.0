'use client'

import { useBoundStore } from '@/src/lib/store/store'
import * as React from 'react'
import { useEffect } from 'react'
import { StoryStep } from '@prisma/client'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { cva, cx } from 'class-variance-authority'
import { navigateToStep } from '@/src/lib/viewerNavigation'

type Props = {
  slug: string
  page: string
  story: any
  variant: 'navbar' | 'primary'
}

export const buttonStyle = cva('', {
  variants: {
    variant: {
      primary: 'h-6 w-6',
      navbar: 'h-6 w-6',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

export function SingleStepBackButton({ slug, page, story, variant }: Props) {
  const setStoryID = useBoundStore(state => state.setStoryID)
  // const { story } = useStory(slug)

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

  function prevStep() {
    // const length = story?.steps?.length
    if (parseInt(page) > 0) {
      navigateToStep(parseInt(page) - 1)
    }
  }

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
  }, [])

  return (
    <>
      <div className="">
        {page != 'start' && (
          <button
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-button-color bg-white text-button-color shadow-sm transition-opacity hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={
              parseInt(page) ===
              Math.min.apply(
                Math,
                story?.steps?.map((step: StoryStep) => step.position),
              )
            }
            onClick={() => prevStep()}
          >
            <ChevronLeftIcon className={cx(buttonStyle({ variant }))} />
          </button>
        )}
      </div>
    </>
  )
}
