import { GalleryList } from '@/src/components/Viewer/Gallery/GalleryList'
import { db } from '@/src/lib/db'
import { Metadata } from 'next/types'

const getMapstories = async () => {
  return await db.story.findMany({
    where: {
      visibility: 'PUBLIC',
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
interface GalleryPageProps {}

export default async function GalleryPage() {
  const certifiedMapstoryIDs: Array<string> =
    //@ts-expect-error
    process.env.GALLERY_STORIES.split(',')

  const mapstories = await getCertifiedMapstories(certifiedMapstoryIDs)
  return (
    <div className="absolute left-5 top-20 z-[1] max-w-[50%]">
      <GalleryList stories={mapstories}></GalleryList>
    </div>
  )
}
