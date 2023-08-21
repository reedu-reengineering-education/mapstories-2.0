import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Gallery',
  openGraph: {
    title: 'Gallery',
  },
}
interface GalleryPageProps {}

export default async function GalleryPage({}: GalleryPageProps) {
  return (
    <div className="absolute left-5 top-20 z-20">
      {/* <GalleryList stories={[]}></GalleryList> */}
    </div>
  )
}
