import { Slides } from '@/src/components/Viewer/Slides'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import { Metadata } from 'next/types'
import { getStoryName } from '@/src/lib/getStoryName'
import { StoryPlayButtons } from '@/src/components/Viewer/StoryPlayButtons'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { redirect } from 'next/navigation'
import { StoryMode } from '@prisma/client'
import TimelineChartWrapper from '@/src/components/Timeline/TimelineChartWrapper'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
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
  params: { slug: string[] }
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

export default async function StoryPage({ params: { slug } }: StoryPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/')
  }
  const story = await getMapstory(slug[0], user.id)

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
            <Slides page={slug[1]} slug={slug[0]} story={story}></Slides>
          </div>
        )}
      </div>
      {story?.mode === StoryMode.TIMELINE && (
        <div className="re-basic-box absolute bottom-10 left-5 z-10 w-2/5 bg-white ">
          <TimelineChartWrapper activeIndex={Number(slug[1])} story={story} />
        </div>
      )}
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transform">
        <StoryPlayButtons
          page={slug[1]}
          slug={slug[0]}
          story={story}

          // toggleSlides={toggleSlidesOpen}
        ></StoryPlayButtons>
      </div>
    </>
  )
}
