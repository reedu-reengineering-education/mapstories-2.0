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
    <>
      <div
        className={cx(
          slug[1] === 'start' ? 'block' : 'hidden',
          'absolute left-5 top-20 z-20 md:block lg:block xl:block',
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
      <div>
        {slug[1] != 'start' && (
          <div className="re-basic-box re-slide absolute bottom-60 right-4 z-20 bg-white p-4 md:right-8 md:max-h-[38rem]  lg:bottom-72 lg:right-16  lg:max-h-[28rem] xl:bottom-72 xl:right-16 xl:max-h-[30rem]">
            <Slides page={slug[1]} slug={slug[0]} story={story}></Slides>
          </div>
        )}
      </div>
      {story?.mode === StoryMode.TIMELINE && (
        <div>
          <div className="absolute bottom-20 z-20 hidden lg:left-16  lg:block xl:left-16 xl:block">
            <SingleStepBackButton
              page={slug[1]}
              slug={slug[0]}
              story={story}
              // toggleSlides={toggleSlidesOpen}
            ></SingleStepBackButton>
          </div>
          <div className="re-basic-box absolute bottom-10 left-1/2 z-10 w-11/12 -translate-x-1/2 bg-white  px-2 lg:w-8/12 xl:bottom-10 xl:w-9/12 ">
            <TimelineChartWrapper
              activeIndex={Number(slug[1])}
              filter={filter}
              story={story}
            />
          </div>
          <div className="absolute bottom-20 right-0 z-20 hidden lg:right-16 lg:block xl:right-16 xl:block">
            <SingleStepForwardButton
              page={slug[1]}
              slug={slug[0]}
              story={story}
              // toggleSlides={toggleSlidesOpen}
            ></SingleStepForwardButton>
          </div>
        </div>
      )}
      {story?.mode === StoryMode.NORMAL && (
        <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transform">
          <StoryPlayButtons
            filter={filterArray}
            page={slug[1]}
            slug={slug[0]}
            story={story}
            // toggleSlides={toggleSlidesOpen}
          ></StoryPlayButtons>
        </div>
      )}
    </>
  )
}
