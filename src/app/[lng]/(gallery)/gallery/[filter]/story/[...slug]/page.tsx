import { Slides } from '@/src/components/Viewer/Slides'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import { Metadata } from 'next/types'
import { getStoryName } from '@/src/lib/getStoryName'
import { StoryPlayButtons } from '@/src/components/Viewer/StoryPlayButtons'
import { db } from '@/src/lib/db'
import { SingleStepBackButton } from '@/src/components/Viewer/SingleStepBackButton'
import TimelineChartWrapper from '@/src/components/Timeline/TimelineChartWrapper'
import { SingleStepForwardButton } from '@/src/components/Viewer/SingleStepForwardButton'
import { StoryMode } from '@prisma/client'
import { cx } from 'class-variance-authority'

export async function generateMetadata({
  params,
}: {
  params: { slug: string; filter: string }
}): Promise<Metadata> {
  const name = (await getStoryName(params.slug[0]))?.name
  return {
    title: name ?? params.slug.toString().split('-')[0],
    openGraph: {
      title: name ?? params.slug.toString().split('-')[0],
    },
  }
}
interface StoryPageProps {
  params: { filter: string; slug: string[] }
}

const getMapstory = async (slug: string) => {
  return await db.story.findFirst({
    where: {
      visibility: 'PUBLIC',
      OR: [{ id: slug }, { slug: slug }],
    },
    include: {
      firstStep: {
        include: {
          content: true,
        },
      },
      steps: {
        include: {
          content: true,
        },
      },
      theme: true,
    },
  })
}

const getMapstoryWithFilter = async (slug: string, filterArray: string[]) => {
  const unfilteredStory = await db.story.findFirst({
    where: {
      visibility: 'PUBLIC',
      OR: [{ id: slug }, { slug: slug }],
    },
    include: {
      firstStep: {
        include: {
          content: true,
        },
      },
      steps: {
        include: {
          content: true,
        },
      },
      theme: true,
    },
  })
  if (!unfilteredStory) {
    return unfilteredStory
  }

  const filteredSteps = unfilteredStory.steps.filter(step =>
    filterArray.every(tag => step.tags.includes(tag)),
  )

  const filteredStepsNewPosition = filteredSteps.map((step, index) => {
    const newStep = { ...step, position: index }
    return newStep
  })

  const newStory = { ...unfilteredStory, steps: filteredStepsNewPosition }

  return newStory
}

export default async function StoryPage({
  params: { slug, filter },
}: StoryPageProps) {
  const filterArray = filter.split('-')
  let story
  let tags: string[] = []
  if (filterArray[0] === 'all') {
    story = await getMapstory(slug[0])
    tags = story?.steps?.map(step => step.tags).flat() ?? []
  } else {
    story = await getMapstoryWithFilter(slug[0], filterArray)
    const mapstorytmp = await getMapstory(slug[0])
    tags = mapstorytmp?.steps?.map(step => step.tags).flat() ?? []
  }

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
