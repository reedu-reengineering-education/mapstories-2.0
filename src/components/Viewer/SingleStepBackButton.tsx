'use client'

import { useBoundStore } from '@/src/lib/store/store'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { StoryStep } from '@prisma/client'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { Button } from '../Elements/Button'
import { cva, cx } from 'class-variance-authority'

type Props = {
  slug: string
  page: string
  story: any
  variant: 'navbar' | 'primary'
}

export const buttonStyle = cva('', {
  variants: {
    variant: {
      primary: 'h-20 w-20 lg:h-10 lg:w-10',
      navbar: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

export function SingleStepBackButton({ slug, page, story, variant }: Props) {
  const router = useRouter()
  const path = usePathname()
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
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    if (parseInt(page) > 0) {
      router.push(`/${pathLocal}/${slug}/${page ? parseInt(page) - 1 : '1'}`)
    }
  }

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
  }, [])

  return (
    <>
      <div className="">
        {page != 'start' && (
          <Button
            disabled={
              parseInt(page) ===
              Math.min.apply(
                Math,
                story?.steps?.map((step: StoryStep) => step.position),
              )
            }
            onClick={() => prevStep()}
            size="verysm"
            value="previous"
            variant={variant === 'navbar' ? 'inverse' : 'inverse'}
          >
            <ChevronLeftIcon className={cx(buttonStyle({ variant }))} />
          </Button>
        )}
      </div>
    </>
  )
}
