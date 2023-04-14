import { Slides } from '@/src/components/Viewer/Slides'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import { StorySlideListViewer } from '@/src/components/Viewer/StorySlideListViewer'

interface StoryPageProps {
  params: { slug: string[] }
}

export default async function StoryPage({ params: { slug } }: StoryPageProps) {
  return (
    <>
      <div className="absolute top-20 left-5 z-20">
        <div className="re-basic-box re-slide bg-white p-4">
          <StoryOverviewControls
            page={slug[1]}
            slug={slug[0]}
          ></StoryOverviewControls>
        </div>
        <StorySlideListViewer
          page={slug[1]}
          slug={slug[0]}
        ></StorySlideListViewer>
      </div>
      <div>
        {slug[1] != 'start' && (
          <div className="re-basic-box re-slide absolute bottom-10 right-5 z-20 bg-white p-4">
            <Slides page={slug[1]} slug={slug[0]}></Slides>
          </div>
        )}
      </div>
    </>
  )
}
