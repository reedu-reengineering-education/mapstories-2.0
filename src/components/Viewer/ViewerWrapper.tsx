'use client'

import { Slides } from '@/src/components/Viewer/Slides'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import { StoryPlayButtons } from '@/src/components/Viewer/StoryPlayButtons'
import { SingleStepBackButton } from '@/src/components/Viewer/SingleStepBackButton'
import TimelineChartWrapper from '@/src/components/Timeline/TimelineChartWrapper'
import { SingleStepForwardButton } from '@/src/components/Viewer/SingleStepForwardButton'
import { Story, StoryMode } from '@prisma/client'
import { cx } from 'class-variance-authority'
import RestartStoryButton from './RestartStoryButton'
import QuitStoryButton from './QuitStoryButton'

type Props = {
  filter: string
  slug: string[]
  story: Story | null
  tags: string[]
}

export function ViewerWrapper({ filter, slug, story, tags }: Props) {
  return (
    <div className="flex h-full w-full flex-col gap-5 px-2  pt-4 lg:pb-10 lg:pt-20">
      <div className="flex flex-1 justify-end overflow-hidden  lg:justify-between ">
        <div
          className={cx(
            slug[1] === 'start' ? 'overflow-auto' : 'hidden lg:block',
            're-basic-box z-10 h-fit max-h-full w-[50%] bg-white p-5  lg:max-w-[33%]',
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
          <div className="re-basic-box z-10 h-full  max-h-full w-[50%] max-w-[50%] self-end overflow-x-auto overflow-y-auto bg-white px-4 lg:w-[33%]">
            <div className="flex flex-row justify-evenly pt-2 lg:hidden">
              <SingleStepBackButton
                page={slug[1]}
                slug={slug[0]}
                story={story}
                variant={'navbar'}
                // toggleSlides={toggleSlidesOpen}
              ></SingleStepBackButton>
              <RestartStoryButton slug={slug[0]} />
              <QuitStoryButton slug={slug[0]} />
              <SingleStepForwardButton
                page={slug[1]}
                slug={slug[0]}
                story={story}
                variant={'navbar'}

                // toggleSlides={toggleSlidesOpen}
              ></SingleStepForwardButton>{' '}
            </div>
            <div className="h-[320px] overflow-scroll lg:h-full">
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
