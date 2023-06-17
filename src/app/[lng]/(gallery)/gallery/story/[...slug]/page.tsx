import { Slides } from '@/src/components/Viewer/Slides'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import { Metadata } from 'next/types'
import { getStoryName } from '@/src/lib/getStoryName'
import { StoryPlayButtons } from '@/src/components/Viewer/StoryPlayButtons'

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

export default async function StoryPage({ params: { slug } }: StoryPageProps) {
  return (
    <>
      <div className="absolute left-5 top-20 z-20">
        <StoryOverviewControls
          page={slug[1]}
          slug={slug[0]}
        ></StoryOverviewControls>
      </div>
      <div>
        {slug[1] != 'start' && (
          <div className="re-basic-box re-slide absolute bottom-28 right-5 z-20 bg-white p-4">
            <Slides page={slug[1]} slug={slug[0]}></Slides>
          </div>
        )}
      </div>
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transform">
        <StoryPlayButtons
          page={slug[1]}
          slug={slug[0]}
          // toggleSlides={toggleSlidesOpen}
        ></StoryPlayButtons>
      </div>
    </>
  )
}
