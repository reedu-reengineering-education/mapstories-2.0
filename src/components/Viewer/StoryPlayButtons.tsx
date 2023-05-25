'use client'

import useStory from '@/src/lib/api/story/useStory'
import { useBoundStore } from '@/src/lib/store/store'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import * as Toolbar from '@radix-ui/react-toolbar'

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useTranslation } from '@/src/app/i18n/client'

type Props = {
  slug: string
  page: string
}

export function StoryPlayButtons({ slug, page }: Props) {
  const router = useRouter()
  const path = usePathname()
  const onMyStoriesRoute = path?.includes('mystories')
  const setStoryID = useBoundStore(state => state.setStoryID)
  const { story } = useStory(slug)

  const updateSelectedStepIndex = useBoundStore(
    state => state.updateSelectedStepIndex,
  )

  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'viewer')

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
    // const length = story?.steps?.length
    if (parseInt(page) + 1 < (story?.steps?.length ?? 0)) {
      onMyStoriesRoute
        ? router.push(
            `/mystories/story/${slug}/${page ? parseInt(page) + 1 : '1'}`,
          )
        : router.push(
            `/gallery/story/${slug}/${page ? parseInt(page) + 1 : '1'}`,
          )
    }
  }

  function prevStep() {
    // const length = story?.steps?.length
    if (parseInt(page) > 0) {
      onMyStoriesRoute
        ? router.push(
            `/mystories/story/${slug}/${page ? parseInt(page) - 1 : '1'}`,
          )
        : router.push(
            `/gallery/story/${slug}/${page ? parseInt(page) - 1 : '1'}`,
          )
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
                    disabled={parseInt(page) === 0}
                    onClick={() => prevStep()}
                    value="previous"
                  >
                    <ChevronLeftIcon className="h-10 w-10" />
                  </Toolbar.ToggleItem>
                  <Toolbar.ToggleItem
                    aria-label="Next"
                    className="ToolbarToggleItem"
                    disabled={
                      story?.steps &&
                      parseInt(page) === story?.steps?.length - 1
                    }
                    onClick={() => nextStep()}
                    value="next"
                  >
                    <ChevronRightIcon className="h-10 w-10 " />
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
