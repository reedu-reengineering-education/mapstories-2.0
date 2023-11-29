'use client'

import { Slides } from '@/src/components/Viewer/Slides'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
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
import { ListBulletIcon } from '@radix-ui/react-icons'
import { StorySlideListViewer } from '@/src/components/Viewer/StorySlideListViewer'
import SlidesOverview from './SlidesOverview'
import PlayStoryButton from './PlayStoryButton'

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
  const [showSlides, setShowSlides] = useState<boolean>(true)
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { t } = useTranslation(lng, 'viewer')

  useEffect(() => {
    setWindowHeight(window.innerHeight)
    setWindowWidth(window.innerWidth)
    // if window size is below 800px display a message saying that the editor is not available on mobile
    if (windowWidth < 600) {
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
    <div className="flex h-full w-full flex-col px-20 pt-4  lg:gap-5 lg:pb-10 lg:pt-20">
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
      <div className="overflow flex flex-1 justify-end overflow-auto align-baseline ">
        <div className="absolute bottom-[50%] left-1 z-10 ">
          <SingleStepBackButton
            page={slug[1]}
            slug={slug[0]}
            story={story}
            variant={'navbar'}
          ></SingleStepBackButton>
        </div>
        <div className="absolute bottom-[50%] right-1 z-20">
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
            're-basic-box z-[60] h-fit max-h-full w-[55%] bg-white px-4 lg:max-w-[50%]',
          )}
        >
          <StoryOverviewControls
            page={slug[1]}
            slug={slug[0]}
            story={story}
            tags={tags}
            // toggleSlides={toggleSlidesOpen}
          ></StoryOverviewControls>
          <div className="re-basic-box absolute bottom-10 right-[50%] z-50 hidden lg:flex lg:flex-row">
            <QuitStoryButton size="s" slug={slug[0]} />
            <PlayStoryButton size="s" slug={slug[0]} />
          </div>
        </div>

        {slug[1] != 'start' && (
          <div className="re-basic-box z-[60]  max-h-full w-[55%]  self-start overflow-x-auto bg-white px-4 pb-4 lg:w-[50%]">
            <div className="sticky top-0 flex flex-row justify-evenly bg-white py-2 ">
              <div>
                <button
                  className="flex items-center"
                  onClick={() => setShowSlides(!showSlides)}
                >
                  <ListBulletIcon className="h-8 w-8"></ListBulletIcon>
                </button>
                <div className="absolute top-0 px-16">
                  <StorySlideListViewer
                    filter={'all'}
                    page={slug[1]}
                    slidesOpen={openInput}
                    slug={slug[0]}
                    story={story}
                  ></StorySlideListViewer>
                </div>
              </div>

              <RestartStoryButton size="xs" slug={slug[0]} />
              <QuitStoryButton size="xs" slug={slug[0]} />
            </div>

            <div className="overflow-y-auto overflow-x-hidden lg:h-full">
              <Slides
                className={cx(showSlides ? 'flex' : 'hidden')}
                page={slug[1]}
                slug={slug[0]}
                story={story}
              ></Slides>
              <div className={cx(showSlides ? 'hidden' : 'flex')}>
                <SlidesOverview
                  lng={lng}
                  page={slug[1]}
                  slug={slug[0]}
                  story={story}
                ></SlidesOverview>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-5 pb-6 lg:p-0">
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
            <div className="re-basic-box z-10 flex-1 bg-white px-2 ">
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
      </div>
    </div>
  )
}
