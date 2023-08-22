import { Slides } from '@/src/components/Viewer/Slides'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import { Metadata } from 'next/types'
import { getStoryName } from '@/src/lib/getStoryName'
import { StoryPlayButtons } from '@/src/components/Viewer/StoryPlayButtons'
import { db } from '@/src/lib/db'

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
  // const story = await getMapstory(slug[0])
  let story
  let tags: string[] = []
  const filterArray = filter.split('-')
  if (filterArray[0] === 'all') {
    story = await getMapstory(slug[0])
    tags = story?.steps.map(step => step.tags).flat() ?? []
  } else {
    story = await getMapstoryWithFilter(slug[0], filterArray)
    const mapstorytmp = await getMapstory(slug[0])
    tags = mapstorytmp?.steps.map(step => step.tags).flat() ?? []
  }

  return (
    <>
      <div className="absolute left-5 top-20 z-20">
        <StoryOverviewControls
          page={slug[1]}
          slug={slug[0]}
          story={story}
          tags={tags}
        ></StoryOverviewControls>
      </div>
      <div>
        {slug[1] != 'start' && (
          <div className="re-basic-box re-slide absolute bottom-28 right-5 z-20 bg-white p-4">
            <Slides page={slug[1]} slug={slug[0]} story={story}></Slides>
          </div>
        )}
      </div>
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transform">
        <StoryPlayButtons
          filter={filterArray}
          page={slug[1]}
          slug={slug[0]}
          story={story}
          // toggleSlides={toggleSlidesOpen}
        ></StoryPlayButtons>
      </div>
    </>
  )
}
