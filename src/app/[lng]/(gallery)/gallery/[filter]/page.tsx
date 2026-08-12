import { GalleryList } from '@/src/components/Viewer/Gallery/GalleryList'
import { db } from '@/src/lib/db'
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
    description: 'In der Galerie werden Mapstories ausgestellt, welche vom Mapstories-Team ausgewählt worden. Wir nehmen gerne Vorschläge für neue Mapstories in dieser Liste auf!',
  openGraph: {
    title: 'Gallery',
    description: 'In der Galerie werden Mapstories ausgestellt, welche vom Mapstories-Team ausgewählt worden. Wir nehmen gerne Vorschläge für neue Mapstories in dieser Liste auf!',
  },
}

export default async function GalleryPage() {
  // First try to get gallery stories from database
  const dbGalleryStories = await db.galleryStory.findMany({
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

  // Extract unique story IDs - only include the main story from each group
  let storyIds: string[] = []
  
  if (dbGalleryStories.length > 0) {
    storyIds = dbGalleryStories.map(gs => gs.storyId)
  } else {
    // Fallback to env variable if no stories in database
    storyIds = (process.env.GALLERY_STORIES ?? '').split(',').filter(id => id.trim())
  }

  const mapstories = await getCertifiedMapstories(storyIds)
  
  // If we got stories from database, maintain the database order
  // Otherwise, stories will be in whatever order the query returns them
  const orderedMapstories = dbGalleryStories.length > 0
    ? storyIds
        .map(id => mapstories.find(m => m.id === id))
        .filter((m): m is typeof mapstories[0] => m !== undefined)
    : mapstories

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-5 top-20 z-[1] max-w-[50%]">
        <GalleryList stories={orderedMapstories}></GalleryList>
      </div>
    </div>
  )
}
