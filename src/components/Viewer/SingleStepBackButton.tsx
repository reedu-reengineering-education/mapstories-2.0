'use client'

import { useBoundStore } from '@/src/lib/store/store'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import * as Toolbar from '@radix-ui/react-toolbar'
import { StoryStep } from '@prisma/client'
import { ChevronLeftIcon } from '@radix-ui/react-icons'

type Props = {
  filter: string[]
  slug: string
  page: string
  story: any
}

export function SingleStepBackButton({ filter, slug, page, story }: Props) {
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
      router.push(`${pathLocal}/${slug}/${page ? parseInt(page) - 1 : '1'}`)
    }
  }

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
  }, [])

  return (
    <>
      <div className="re-basic-box bg-white">
        {page != 'start' && (
          <>
            <div className="flex justify-between text-black">
              <Toolbar.Root aria-label="StoryControls" className="ToolbarRoot">
                <Toolbar.ToggleGroup aria-label="Story Contols" type="multiple">
                  <Toolbar.ToggleItem
                    aria-label="Previous"
                    className="ToolbarToggleItem"
                    disabled={
                      parseInt(page) ===
                      Math.min.apply(
                        Math,
                        story?.steps?.map((step: StoryStep) => step.position),
                      )
                    }
                    onClick={() => prevStep()}
                    value="previous"
                  >
                    <ChevronLeftIcon className="h-10 w-10" />
                  </Toolbar.ToggleItem>
                </Toolbar.ToggleGroup>
              </Toolbar.Root>
            </div>
          </>
        )}
      </div>
    </>
  )
}
