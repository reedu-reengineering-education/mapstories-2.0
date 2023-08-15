'use client'

import { Button } from '@/src/components/Elements/Button'
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
  ReaderIcon,
  ReloadIcon,
} from '@radix-ui/react-icons'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useTranslation } from '@/src/app/i18n/client'
import { Input } from '../Elements/Input'
import { Modal } from '../Modal'
import { StoryStep } from '@prisma/client'

type Props = {
  slug: string
  page: string
  story: any
  //  (Story & {
  //     steps?: (StoryStep & { content: SlideContent[] })[]
  //     firstStep?: StoryStep & { content: SlideContent[] }
  //   })
}

export function StoryOverviewControls({ slug, page, story }: Props) {
  const router = useRouter()
  const path = usePathname()
  const onMyStoriesRoute = path?.includes('mystories')
  const setStoryID = useBoundStore(state => state.setStoryID)
  const setSlidesOpen = useBoundStore(state => state.setSlidesOpen)
  const slidesOpen = useBoundStore(state => state.slidesOpen)
  const setViewerStories = useBoundStore(state => state.setViewerStories)
  const [filter, setFilter] = React.useState(path?.split('/')[3])
  const updateSelectedStepIndex = useBoundStore(
    state => state.updateSelectedStepIndex,
  )

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

  useEffect(() => {
    updateSelectedStepIndex(parseInt(page))
    if (page === 'start') {
      setSlidesOpen(false)
    }
  }, [])

  function startStory() {
    const positions = story?.steps?.map((step: StoryStep) => step?.position)
    const lowestPosition = Math.min(...positions)
    onMyStoriesRoute
      ? router.push(`/mystories/${filter}/story/${slug}/${lowestPosition}`)
      : router.push(`/gallery/story/${slug}/${filter}/${lowestPosition}`)
  }
  function backToStart() {
    onMyStoriesRoute
      ? router.push(`/mystories/${filter}/story/${slug}/start`)
      : router.push(`/gallery/story/${slug}/${filter}/start`)
  }

  function applyFilter() {
    onMyStoriesRoute
      ? router.push(`/mystories/${filter}/story/${slug}/start`)
      : router.push(`/gallery/story/${slug}/start`)
    setOpen(false)
  }

  return (
    <>
      <div className="re-basic-box  bg-white p-4">
        {!story && <p>{t('storyNotAvailable')}</p>}
        {story && (
          <div>
            <div className="bg-gray">
              <h3 className="max-w-[500px]">{story?.name}</h3>
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
                  <Modal
                    onOpenChange={setOpen}
                    open={open}
                    title={'apply filter'}
                    trigger={
                      <Button startIcon={<ReaderIcon className="w-4" />}>
                        {t('filter')}
                      </Button>
                    }
                  >
                    <Modal.Content>
                      <div className="flex flex-col gap-2">
                        <Input
                          label={t('filter')}
                          onChange={e => setFilter(e.target.value)}
                          value={filter}
                        ></Input>
                        <div className="flex flex-row justify-evenly gap-2">
                          <Button
                            onClick={() => {
                              setFilter('all')
                              applyFilter()
                            }}
                            startIcon={<ReloadIcon className="w-4" />}
                            variant={'inverse'}
                          >
                            {t('reset')}
                          </Button>
                          <Button
                            onClick={() => applyFilter()}
                            startIcon={<ReloadIcon className="w-4" />}
                          >
                            {t('apply')}
                          </Button>
                        </div>
                      </div>
                    </Modal.Content>
                  </Modal>

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
        )}
      </div>
      <StorySlideListViewer
        filter={filter ? filter : 'all'}
        page={page}
        slidesOpen={slidesOpen}
        slug={slug}
      ></StorySlideListViewer>
    </>
  )
}
