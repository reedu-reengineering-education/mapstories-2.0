import { Slides } from '@/src/components/Viewer/Slides'

interface StoryPageProps {
  params: { slug: string[] }
}

export default async function StoryPage({ params: { slug } }: StoryPageProps) {
  return (
    <div>
      <div className="re-basic-box absolute bottom-10 right-5 z-20 bg-white p-4">
        <Slides page={slug[1]} slug={slug[0]}></Slides>
      </div>
    </div>
  )
}
