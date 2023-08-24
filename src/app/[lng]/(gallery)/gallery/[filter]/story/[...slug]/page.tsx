import { Metadata } from 'next/types'
import { getStoryName } from '@/src/lib/getStoryName'
import { db } from '@/src/lib/db'
import { ViewerWrapper } from '@/src/components/Viewer/ViewerWrapper'

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
    <ViewerWrapper
      filter={filter}
      slug={slug}
      story={story}
      tags={tags}
    ></ViewerWrapper>
  )
}
