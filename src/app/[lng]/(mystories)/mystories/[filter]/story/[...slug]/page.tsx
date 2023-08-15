import { Metadata } from 'next/types'
import { getStoryName } from '@/src/lib/getStoryName'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { redirect } from 'next/navigation'
import { StoryPlayButtons } from '@/src/components/Viewer/StoryPlayButtons'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import TimelineChartWrapper from '@/src/components/Timeline/TimelineChartWrapper'
import { StoryMode } from '@prisma/client'
import { Slides } from '@/src/components/Viewer/Slides'

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

const getMapstory = async (slug: string, userId: string) => {
  return await db.story.findFirst({
    where: {
      ownerId: userId,
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
    },
  })
}

const getMapstoryWithFilter = async (
  slug: string,
  userId: string,
  filter: string,
) => {
  const unfilteredStory = await db.story.findFirst({
    where: {
      ownerId: userId,
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
    },
  })
  if (!unfilteredStory) {
    return unfilteredStory
  }
  const filteredStories = unfilteredStory?.steps.filter(step => {
    return step.tags.includes(filter)
  })

  return { ...unfilteredStory, steps: filteredStories }
}

export default async function StoryPage({
  params: { slug, filter },
}: StoryPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/')
  }

  let story
  if (filter === 'all') {
    story = await getMapstory(slug[0], user.id)
  } else {
    story = await getMapstoryWithFilter(slug[0], user.id, filter)
  }

  return (
    <>
      <div className="absolute left-5 top-20 z-20">
        <StoryOverviewControls
          page={slug[1]}
          slug={slug[0]}
          story={story}
          // toggleSlides={toggleSlidesOpen}
        ></StoryOverviewControls>
      </div>
      <div>
        {slug[1] != 'start' && (
          <div className="re-basic-box re-slide absolute bottom-28 right-5 z-20 bg-white p-4">
            <Slides page={filter} slug={slug[0]} story={story}></Slides>
          </div>
        )}
      </div>
      {story?.mode === StoryMode.TIMELINE && (
        <div className="re-basic-box absolute bottom-10 left-5 z-10 w-2/5 bg-white ">
          <TimelineChartWrapper
            activeIndex={Number(slug[1])}
            filter={filter}
            story={story}
          />
        </div>
      )}
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transform">
        <StoryPlayButtons
          filter={filter}
          page={slug[1]}
          slug={slug[0]}
          story={story}
          // toggleSlides={toggleSlidesOpen}
        ></StoryPlayButtons>
      </div>
    </>
  )
}
