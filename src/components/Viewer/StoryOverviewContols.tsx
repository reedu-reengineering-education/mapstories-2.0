'use client'

import { Button } from '@/src/components/Elements/Button'
import useStory from '@/src/lib/api/story/useStory'
import { useBoundStore } from '@/src/lib/store/store'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { Slide } from './Slide'
import * as Toolbar from '@radix-ui/react-toolbar'
import { StorySlideListViewer } from '@/src/components/Viewer/StorySlideListViewer'

import {
  CaretDownIcon,
  Cross1Icon,
  PlayIcon,
  ReloadIcon,
} from '@radix-ui/react-icons'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useTranslation } from '@/src/app/i18n/client'

type Props = {
  slug: string
  page: string
}

export function StoryOverviewControls({ slug, page }: Props) {
  const router = useRouter()
  const path = usePathname()
  const onMyStoriesRoute = path?.includes('mystories')
  const setStoryID = useBoundStore(state => state.setStoryID)
  const { story } = useStory(slug)
  const setSlidesOpen = useBoundStore(state => state.setSlidesOpen)
  const slidesOpen = useBoundStore(state => state.slidesOpen)

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
    // if (page === 'start') {
    //   setSlidesOpen(false)
    // }

    updateSelectedStepIndex(parseInt(page))
    // if (parseInt(page) == 0) {
    //   setSlidesOpen(true)
    // }
  }, [page])

  function onClose() {
    onMyStoriesRoute ? router.push('mystories') : router.push('gallery')
  }

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
    setSlidesOpen(false)
  }, [])

  function startStory() {
    onMyStoriesRoute
      ? router.push(`/mystories/story/${slug}/0`)
      : router.push(`/gallery/story/${slug}/0`)
  }
  function backToStart() {
    onMyStoriesRoute
      ? router.push(`/mystories/story/${slug}/start`)
      : router.push(`/gallery/story/${slug}/start`)
  }

  return (
    <>
      <div className="re-basic-box  bg-white p-4">
        <div className="">
          <div className="bg-gray">
            <h3>{story?.name}</h3>
          </div>
          {page == 'start' && (
            <div className="re-title-slide overflow-x-hidden pr-5">
              <Slide step={story?.firstStep}></Slide>
              <div className="flex justify-between">
                <Button
                  onClick={() => startStory()}
                  startIcon={<PlayIcon className="w-4" />}
                >
                  {t('play')}
                </Button>

                <Button
                  onClick={onClose}
                  startIcon={<Cross1Icon className="w-4" />}
                >
                  {t('close')}
                </Button>
              </div>
            </div>
          )}
          {page != 'start' && (
            <>
              <div className="flex justify-between pt-2">
                <button
                  className="flex items-center"
                  onClick={() => setSlidesOpen(!slidesOpen)}
                >
                  <span className="whitespace-nowrap">
                    {parseInt(page) + 1}/{story?.steps?.length}
                  </span>
                  <CaretDownIcon className="h-8 w-8"></CaretDownIcon>
                </button>

                <Toolbar.Root
                  aria-label="StoryControls"
                  className="ToolbarRoot"
                >
                  {/* <Toolbar.ToggleGroup
                    aria-label="Story Contols"
                    type="multiple"
                  >
                    <Toolbar.ToggleItem
                      aria-label="Home"
                      className="ToolbarToggleItem"
                      onClick={() => backToStart()}
                      value="home"
                    >
                      <HomeIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                      aria-label="Previous"
                      className="ToolbarToggleItem"
                      onClick={() => prevStep()}
                      value="previous"
                    >
                      <TrackPreviousIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                      aria-label="Next"
                      className="ToolbarToggleItem"
                      onClick={() => nextStep()}
                      value="next"
                    >
                      <TrackNextIcon />
                    </Toolbar.ToggleItem>
                  </Toolbar.ToggleGroup>
                  <Toolbar.Separator className="ToolbarSeparator" /> */}
                  <Toolbar.ToggleGroup
                    aria-label="Viewer Controls"
                    defaultValue="center"
                    type="single"
                  >
                    <Toolbar.ToggleItem
                      aria-label="Restart story"
                      className="ToolbarToggleItem"
                      onClick={() => startStory()}
                      title="Restart Story"
                      value="restart"
                    >
                      <ReloadIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                      aria-label="Quit story"
                      className="ToolbarToggleItem"
                      onClick={onClose}
                      title="Quit Story"
                      value="quit"
                    >
                      <Cross1Icon />
                    </Toolbar.ToggleItem>
                  </Toolbar.ToggleGroup>
                </Toolbar.Root>
              </div>
            </>
          )}
        </div>
      </div>
      <StorySlideListViewer
        page={page}
        slidesOpen={slidesOpen}
        slug={slug}
      ></StorySlideListViewer>
    </>
  )
}
