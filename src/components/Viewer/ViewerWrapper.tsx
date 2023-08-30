'use client'

import { Slides } from '@/src/components/Viewer/Slides'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import { StoryPlayButtons } from '@/src/components/Viewer/StoryPlayButtons'
import { SingleStepBackButton } from '@/src/components/Viewer/SingleStepBackButton'
import TimelineChartWrapper from '@/src/components/Timeline/TimelineChartWrapper'
import { SingleStepForwardButton } from '@/src/components/Viewer/SingleStepForwardButton'
import { Story, StoryMode } from '@prisma/client'
import { cx } from 'class-variance-authority'

type Props = {
  filter: string
  slug: string[]
  story: Story | null
  tags: string[]
}

export function ViewerWrapper({ filter, slug, story, tags }: Props) {
  return (
    <div className="flex h-full w-full flex-col gap-5 px-5 pb-12 pt-20 md:pb-10">
      <div className="flex flex-1 flex-col  overflow-hidden pb-2 pr-2 ">
        <div
          className={cx(
            're-basic-box z-10 hidden  max-h-full max-w-[33%]  overflow-x-auto overflow-y-auto bg-white p-5 md:block',
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
          <div className="re-basic-box z-10 max-h-full w-80 max-w-[50%] self-end overflow-x-auto overflow-y-auto bg-white px-4 md:w-[500px]">
            <Slides page={slug[1]} slug={slug[0]} story={story}></Slides>
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
                // toggleSlides={toggleSlidesOpen}
              ></SingleStepForwardButton>
            </div>
          </>
        )}
        {story?.mode === StoryMode.NORMAL && (
          <div className="z-20">
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
