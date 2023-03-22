'use client'

import { SlideContent, StoryStep } from '@prisma/client'
import { Slide } from '../../Viewer/Slide'
import { useStoryStore } from '@/src/lib/store/story'

type Props = {
  step:
    | (StoryStep & {
        content?: SlideContent[] | undefined
      })
    | undefined
}

export default function PreviewSlide({ step }: Props) {
  const { showSlidePreview } = useStoryStore()
  return (
    <>
      {showSlidePreview && (
        // TODO: Styling
        <div className="re-basic-box absolute bottom-10 right-1/2 z-20 bg-white p-4">
          <Slide step={step}></Slide>
        </div>
      )}
    </>
  )
}
