import { GalleryList } from '@/src/components/Viewer/Gallery/GalleryList'
import { db } from '@/src/lib/db'
import { getCurrentSite } from '@/src/lib/site'
import { Metadata } from 'next/types'

const getCertifiedMapstories = async (array: Array<string>) => {
  return await db.story.findMany({
    where: {
      visibility: 'PUBLIC',
      OR: [
        {
          id: {
            in: array,
          },
        },
        {
          slug: {
            in: array,
          },
        },
      ],
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

export const metadata: Metadata = {
  title: 'Gallery',
  openGraph: {
    title: 'Gallery',
  },
}
interface GalleryPageProps {}

export default async function GalleryPage() {
  const site = getCurrentSite()

  // First try to get gallery stories from database
  const dbGalleryStories = await db.galleryStory.findMany({
    where: { site },
    include: {
      story: {
        include: {
          group: {
            include: {
              stories: true,
            },
          },
        },
      },
    },
    orderBy: { position: 'asc' },
  })

  // Extract unique story IDs
  let storyIds: string[] = []
  
  if (dbGalleryStories.length > 0) {
    storyIds = dbGalleryStories.map(gs => gs.storyId)
  } else {
    // Fallback to env variable if no stories in database
    const envVar = site === 'BFDW' ? 'GALLERY_STORIES_BFDW' : 'GALLERY_STORIES'
    storyIds = (process.env[envVar] ?? '').split(',').filter(id => id.trim())
  }

  const mapstories = await getCertifiedMapstories(storyIds)
  
  // Maintain database order if stories come from database
  const orderedMapstories = dbGalleryStories.length > 0
    ? storyIds
        .map(id => mapstories.find(m => m.id === id))
        .filter((m): m is typeof mapstories[0] => m !== undefined)
    : mapstories

  return (
    <div className="absolute left-5 top-20 z-20">
      <GalleryList stories={orderedMapstories}></GalleryList>
    </div>
  )
}
