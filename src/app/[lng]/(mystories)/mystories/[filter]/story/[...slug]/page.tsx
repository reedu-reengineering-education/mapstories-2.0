import { Metadata } from 'next/types'
import { getStoryName } from '@/src/lib/getStoryName'
import { db } from '@/src/lib/db'
import { getCurrentUser } from '@/src/lib/session'
import { redirect } from 'next/navigation'
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
        orderBy: {
          position: 'asc',
        },
      },
    },
  })
}

const getMapstoryWithFilter = async (
  slug: string,
  userId: string,
  filterArray: string[],
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
  const user = await getCurrentUser()
  if (!user) {
    redirect('/')
  }
  const filterArray = filter.split('-')
  let story
  let tags: string[] = []
  if (filterArray[0] === 'all') {
    story = await getMapstory(slug[0], user.id)
    tags = story?.steps?.map(step => step.tags).flat() ?? []
  } else {
    story = await getMapstoryWithFilter(slug[0], user.id, filterArray)
    const mapstorytmp = await getMapstory(slug[0], user.id)
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
