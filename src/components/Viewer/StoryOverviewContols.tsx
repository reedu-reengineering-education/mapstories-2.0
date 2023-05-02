'use client'

import { Button } from '@/src/components/Elements/Button'
import useStory from '@/src/lib/api/story/useStory'
import { useBoundStore } from '@/src/lib/store/store'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { Slide } from './Slide'
import * as Toolbar from '@radix-ui/react-toolbar'
import { StorySlideListViewer } from '@/src/components/Viewer/StorySlideListViewer'

import {
  CaretDownIcon,
  Cross1Icon,
  HomeIcon,
  PlayIcon,
  ReloadIcon,
  TrackNextIcon,
  TrackPreviousIcon,
} from '@radix-ui/react-icons'

type Props = {
  slug: string
  page: string
}

export function StoryOverviewControls({ slug, page }: Props) {
  const router = useRouter()
  const setStoryID = useBoundStore(state => state.setStoryID)
  const { story } = useStory(slug)
  // const [slidesOpen, setSlidesOpen] = useState(false)
  const setSlidesOpen = useBoundStore(state => state.setSlidesOpen)
  const slidesOpen = useBoundStore(state => state.slidesOpen)

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
    // if (page === 'start') {
    //   setSlidesOpen(false)
    // }

    updateSelectedStepIndex(parseInt(page))
    if (parseInt(page) == 0) {
      setSlidesOpen(true)
    }
  }, [page])

  function nextStep() {
    // const length = story?.steps?.length
    if (parseInt(page) + 1 < (story?.steps?.length ?? 0)) {
      router.push(`/viewer/story/${slug}/${page ? parseInt(page) + 1 : '1'}`)
    }
  }

  function prevStep() {
    // const length = story?.steps?.length
    if (parseInt(page) > 0) {
      router.push(`/viewer/story/${slug}/${page ? parseInt(page) - 1 : '1'}`)
    }
  }

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
  }, [])

  function startStory() {
    router.push(`/viewer/story/${slug}/0`)
  }
  function backToStart() {
    router.push(`/viewer/story/${slug}/start`)
  }

  return (
    <>
      <div className="re-basic-box bg-white p-4">
        <div className="">
          <div className="bg-gray">
            <h3>{story?.name}</h3>
          </div>
          {page == 'start' && (
            <>
              <Slide step={story?.firstStep}></Slide>
              <div className="flex justify-between">
                <Button
                  onClick={() => startStory()}
                  startIcon={<PlayIcon className="w-4" />}
                >
                  Abspielen
                </Button>

                <Button
                  onClick={() => router.push('viewer')}
                  startIcon={<Cross1Icon className="w-4" />}
                >
                  Abbrechen
                </Button>
              </div>
            </>
          )}
          {page != 'start' && (
            <>
              <div className="flex justify-between pt-2">
                <button
                  className="flex items-center"
                  onClick={() => setSlidesOpen(!slidesOpen)}
                >
                  <span className="whitespace-nowrap">
                    Schritt {parseInt(page) + 1}/{story?.steps?.length}
                  </span>
                  <CaretDownIcon className="h-8 w-8"></CaretDownIcon>
                </button>

                <Toolbar.Root
                  aria-label="StoryControls"
                  className="ToolbarRoot"
                >
                  <Toolbar.ToggleGroup
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
                  <Toolbar.Separator className="ToolbarSeparator" />
                  <Toolbar.ToggleGroup
                    aria-label="Viewer Controls"
                    defaultValue="center"
                    type="single"
                  >
                    <Toolbar.ToggleItem
                      aria-label="Restart story"
                      className="ToolbarToggleItem"
                      onClick={() => startStory()}
                      value="restart"
                    >
                      <ReloadIcon />
                    </Toolbar.ToggleItem>
                    <Toolbar.ToggleItem
                      aria-label="Quit story"
                      className="ToolbarToggleItem"
                      onClick={() => router.push('viewer')}
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
