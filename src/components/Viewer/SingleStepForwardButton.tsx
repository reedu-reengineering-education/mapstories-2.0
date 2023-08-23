'use client'

import { useBoundStore } from '@/src/lib/store/store'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { StoryStep } from '@prisma/client'
import { ChevronRightIcon } from 'lucide-react'
import { Button } from '../Elements/Button'

type Props = {
  slug: string
  page: string
  story: any
}

export function SingleStepForwardButton({ slug, page, story }: Props) {
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

  function nextStep() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    if (parseInt(page) + 1 < (story?.steps?.length ?? 0)) {
      router.push(`${pathLocal}/${slug}/${page ? parseInt(page) + 1 : '1'}`)
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
            className="bg-transparent px-0 lg:rounded-md lg:border-black lg:bg-white lg:px-4 xl:rounded-md xl:border-black xl:bg-white xl:px-4"
            disabled={
              parseInt(page) ===
              Math.max.apply(
                Math,
                story?.steps?.map((step: StoryStep) => step.position),
              )
            }
            onClick={() => nextStep()}
            value="previous"
          >
            <ChevronRightIcon className="h-20 w-20 text-black  lg:h-10 lg:w-10 xl:h-10 xl:w-10" />
          </Button>
        )}
      </div>
    </>
  )
}
