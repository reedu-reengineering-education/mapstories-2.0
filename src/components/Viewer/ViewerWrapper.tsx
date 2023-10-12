'use client'

import { Slides } from '@/src/components/Viewer/Slides'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import { StoryPlayButtons } from '@/src/components/Viewer/StoryPlayButtons'
import { SingleStepBackButton } from '@/src/components/Viewer/SingleStepBackButton'
import TimelineChartWrapper from '@/src/components/Timeline/TimelineChartWrapper'
import { SingleStepForwardButton } from '@/src/components/Viewer/SingleStepForwardButton'
import { StoryMode } from '@prisma/client'
import { cx } from 'class-variance-authority'
import RestartStoryButton from './RestartStoryButton'
import QuitStoryButton from './QuitStoryButton'
import useSwipe from '@/src/lib/useSwipe'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Modal } from '../Modal'
import { Button } from '../Elements/Button'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { CaretDownIcon } from '@radix-ui/react-icons'
import { StorySlideListViewer } from '@/src/components/Viewer/StorySlideListViewer'

type Props = {
  filter: string
  slug: string[]
  story: any
  tags: string[]
}

export function ViewerWrapper({ filter, slug, story, tags }: Props) {
  const router = useRouter()
  const path = usePathname()
  const [showSizeModal, setShowSizeModal] = useState<boolean>(false)
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight)
  const [openInput, setOpenInput] = useState<boolean>(false)
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { t } = useTranslation(lng, 'viewer')

  useEffect(() => {
    setWindowHeight(window.innerHeight)
    setWindowWidth(window.innerWidth)
    // if window size is below 800px display a message saying that the editor is not available on mobile
    if (windowWidth < 800) {
      setShowSizeModal(true)
    }
  }, [])

  function prevStep() {
    // const length = story?.steps?.length
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    if (parseInt(slug[1]) > 0) {
      router.push(
        `${pathLocal}/${slug[0]}/${slug[1] ? parseInt(slug[1]) - 1 : '1'}`,
      )
    }
  }

  function nextStep() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    if (parseInt(slug[1]) + 1 < (story?.steps?.length ?? 0)) {
      router.push(
        `${pathLocal}/${slug[0]}/${slug[1] ? parseInt(slug[1]) + 1 : '1'}`,
      )
    }
  }

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => nextStep(),
    onSwipedRight: () => prevStep(),
  })

  return (
    <div className="flex h-full w-full flex-col gap-5 px-20  pt-4 lg:pb-10 lg:pt-20">
      {showSizeModal && (
        <Modal
          onClose={() => setShowSizeModal(false)}
          open={showSizeModal}
          title={t('landscapeModeTitle')}
        >
          <Modal.Content>
            <p>{t('landscapeModeText')}</p>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex justify-end">
              <Button onClick={() => setShowSizeModal(false)}>Ok</Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
      <div className="flex flex-1 justify-end overflow-hidden align-baseline lg:justify-between ">
        <div className="absolute bottom-[50%] left-1 z-10 lg:hidden">
          <SingleStepBackButton
            page={slug[1]}
            slug={slug[0]}
            story={story}
            variant={'navbar'}
          ></SingleStepBackButton>
        </div>
        <div className="absolute bottom-[50%] right-1 z-20 lg:hidden">
          <SingleStepForwardButton
            page={slug[1]}
            slug={slug[0]}
            story={story}
            variant={'navbar'}
          ></SingleStepForwardButton>
        </div>
        <div
          className={cx(
            slug[1] === 'start' ? 'flex overflow-auto' : 'hidden',
            're-basic-box z-20 h-fit max-h-full w-[55%] bg-white px-4 lg:flex lg:max-w-[40%]',
          )}
        >
          <StoryOverviewControls
            page={slug[1]}
            slug={slug[0]}
            story={story}
            tags={tags}
            // toggleSlides={toggleSlidesOpen}
          ></StoryOverviewControls>
        </div>
        {slug[1] != 'start' && (
          <div className="re-basic-box z-20 h-full  max-h-full w-[55%]  self-end overflow-x-auto overflow-y-auto bg-white p-4 lg:w-[40%]">
            <div className="flex flex-row justify-evenly pt-2 lg:hidden">
              <button
                className="flex items-center"
                onClick={() => setOpenInput(!openInput)}
              >
                <span className="whitespace-nowrap">
                  {parseInt(slug[1]) + 1}/{story?.steps?.length}
                </span>
                <CaretDownIcon className="h-8 w-8"></CaretDownIcon>
              </button>
              <StorySlideListViewer
                filter={'all'}
                page={slug[1]}
                slidesOpen={openInput}
                slug={slug[0]}
                story={story}
              ></StorySlideListViewer>
              <RestartStoryButton slug={slug[0]} />
              <QuitStoryButton slug={slug[0]} />
            </div>

            <div
              className="h-[320px] overflow-scroll lg:h-full"
              {...swipeHandlers}
            >
              <Slides page={slug[1]} slug={slug[0]} story={story}></Slides>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-5">
        {story?.mode === StoryMode.TIMELINE && (
          <>
            <div className="z-20 hidden lg:block">
              <SingleStepBackButton
                page={slug[1]}
                slug={slug[0]}
                story={story}
                variant={'primary'}
                // toggleSlides={toggleSlidesOpen}
              ></SingleStepBackButton>
            </div>
            <div className="re-basic-box z-10 flex-1 bg-white px-2">
              <TimelineChartWrapper
                activeIndex={Number(slug[1])}
                filter={filter}
                story={story as any}
              />
            </div>
            <div className="z-20 hidden lg:block">
              <SingleStepForwardButton
                page={slug[1]}
                slug={slug[0]}
                story={story}
                variant={'primary'}
                // toggleSlides={toggleSlidesOpen}
              ></SingleStepForwardButton>
            </div>
          </>
        )}
        {story?.mode === StoryMode.NORMAL && (
          <div className="z-20 hidden lg:block">
            <StoryPlayButtons
              page={slug[1]}
              slug={slug[0]}
              story={story}
              // toggleSlides={toggleSlidesOpen}
            ></StoryPlayButtons>
          </div>
        )}
      </div>
    </div>
  )
}
