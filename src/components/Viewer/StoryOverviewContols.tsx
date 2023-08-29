'use client'

import { Button } from '@/src/components/Elements/Button'
import { useBoundStore } from '@/src/lib/store/store'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { Slide } from './Slide'
import * as Toolbar from '@radix-ui/react-toolbar'
import { StorySlideListViewer } from '@/src/components/Viewer/StorySlideListViewer'
import { StoryFilterInput } from './StoryFilterInput'
import {
  CaretDownIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
  PlayIcon,
  ReloadIcon,
} from '@radix-ui/react-icons'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useTranslation } from '@/src/app/i18n/client'
type Props = {
  slug: string
  page: string
  story: any
  tags: string[]
  //  (Story & {
  //     steps?: (StoryStep & { content: SlideContent[] })[]
  //     firstStep?: StoryStep & { content: SlideContent[] }
  //   })
}

export function StoryOverviewControls({ slug, page, story, tags }: Props) {
  const router = useRouter()
  const path = usePathname()
  const onMyStoriesRoute = path?.includes('mystories')
  const setStoryID = useBoundStore(state => state.setStoryID)
  const setSlidesOpen = useBoundStore(state => state.setSlidesOpen)
  const slidesOpen = useBoundStore(state => state.slidesOpen)
  const setViewerStories = useBoundStore(state => state.setViewerStories)
  const [filterState, setFilterState] = React.useState(
    path?.split('/')[3].split('-'),
  )
  const [allTags, setAllTags] = React.useState<string[]>(tags)
  const updateSelectedStepIndex = useBoundStore(
    state => state.updateSelectedStepIndex,
  )
  const [openInput, setOpenInput] = React.useState(slidesOpen)

  const userStory = useBoundStore(state => state.viewerStories)
  const [open, setOpen] = React.useState(false)
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'viewer')

  useEffect(() => {
    if (story) {
      setStoryID(story.id)
      if (!onMyStoriesRoute) {
        //@ts-ignore
        setViewerStories([story])
      }
    } else {
      setStoryID('')
    }
  }, [story])

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
  }, [page])

  useEffect(() => {
    setSlidesOpen(openInput)
  }, [openInput])

  function onClose() {
    const pathLocal = path?.split('/').splice(2, 2)
    if (pathLocal) {
      pathLocal[1] = 'all'
      const newPath = pathLocal.join('/') ?? 'gallery/all/story/'
      router.push(`${newPath}`)
    }
  }

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
    if (page === 'start') {
      setSlidesOpen(false)
    }
  }, [])

  function startStory() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    router.push(`${pathLocal}/${slug}/0`)
  }
  function backToStart() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    router.push(`${pathLocal}/${slug}/start`)
  }

  function applyFilter(filter?: string[]) {
    if (!filter || filter[0] === '') {
      setFilterState(['all'])
    }
    const path = onMyStoriesRoute
      ? `/mystories/${filterState?.join('-')}/story/${slug}/start`
      : `/gallery/${filterState?.join('-')}/story/${slug}/start`

    router.push(path)
    setOpen(false)
  }

  return (
    <>
      <div className="re-basic-box  bg-white p-4">
        {!story && <p>{t('storyNotAvailable')}</p>}
        {story && (
          <div className="flex max-w-fit flex-col">
            <div className="bg-gray flex flex-row gap-2">
              <h3 className="max-w-[500px]">{story?.name}</h3>
            </div>

            {page == 'start' && (
              <div>
                <div>
                  <StoryFilterInput
                    allTags={allTags}
                    filter={filterState ? filterState : ['all']}
                    onFilterChange={applyFilter}
                  />
                </div>
                {story?.steps?.length === 0 && (
                  <div className="flex flex-row items-center gap-2">
                    <ExclamationTriangleIcon className=" text-yellow-500" />
                    <div className="h text-yellow-500">{t('noSteps')}</div>
                  </div>
                )}
                <div className="re-title-slide overflow-x-hidden pr-5">
                  <Slide step={story?.firstStep}></Slide>
                  <div className="flex gap-6">
                    {!path?.includes('/embed/') && (
                      <Button
                        onClick={onClose}
                        startIcon={<Cross1Icon className="w-4" />}
                      >
                        {t('close')}
                      </Button>
                    )}
                    <Button
                      disabled={story?.steps?.length === 0}
                      onClick={() => startStory()}
                      startIcon={<PlayIcon className="w-4" />}
                    >
                      {t('play')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {page != 'start' && (
              <>
                <div className="flex justify-between pt-2">
                  <button
                    className="flex items-center"
                    onClick={() => setOpenInput(!openInput)}
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
                    <Toolbar.ToggleGroup
                      aria-label="Viewer Controls"
                      defaultValue="center"
                      type="single"
                    >
                      <Toolbar.ToggleItem
                        aria-label="Restart story"
                        className="ToolbarToggleItem"
                        onClick={() => backToStart()}
                        title="Restart Story"
                        value="restart"
                      >
                        <ReloadIcon />
                      </Toolbar.ToggleItem>
                      {!path?.includes('/embed/') && (
                        <Toolbar.ToggleItem
                          aria-label="Quit story"
                          className="ToolbarToggleItem"
                          onClick={onClose}
                          title="Quit Story"
                          value="quit"
                        >
                          <Cross1Icon />
                        </Toolbar.ToggleItem>
                      )}
                    </Toolbar.ToggleGroup>
                  </Toolbar.Root>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <StorySlideListViewer
        filter={filterState ? filterState.join('-') : 'all'}
        page={page}
        slidesOpen={openInput}
        slug={slug}
        story={story}
      ></StorySlideListViewer>
    </>
  )
}
