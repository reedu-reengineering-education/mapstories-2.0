'use client'

import { Slide } from '../../Viewer/Slide'
import { useBoundStore } from '@/src/lib/store/store'
import useStep from '@/src/lib/api/step/useStep'

type Props = {
  stepId: string
}

export default function PreviewSlide({ stepId }: Props) {
  const { showSlidePreview } = useBoundStore()
  const { step } = useStep(stepId)

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
