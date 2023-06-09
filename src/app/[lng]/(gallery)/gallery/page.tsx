import { GalleryList } from '@/src/components/Viewer/Gallery/GalleryList'
import { db } from '@/src/lib/db'
import { Metadata } from 'next/types'

const getMapstories = async () => {
  console.log('sss')

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
      id: {
        in: array,
      },
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

export const metadata: Metadata = {
  title: 'Gallery',
  openGraph: {
    title: 'Gallery',
  },
}
interface GalleryPageProps {}

export default async function GalleryPage({}: GalleryPageProps) {
  const certifiedMapstoryIDs: Array<string> = []
  const mapstories = await getCertifiedMapstories(certifiedMapstoryIDs)
  return (
    <div className="absolute left-5 top-20 z-20">
      <GalleryList stories={mapstories}></GalleryList>
    </div>
  )
}
