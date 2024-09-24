'use client'

import { Slide } from '../../Viewer/Slide'
import { useBoundStore } from '@/src/lib/store/store'
import useStep from '@/src/lib/api/step/useStep'
import { Button } from '../../Elements/Button'
import { XIcon } from 'lucide-react'

type Props = {
  stepId: string
}

export default function PreviewSlide({ stepId }: Props) {
  const { showSlidePreview, setShowSlidePreview } = useBoundStore()
  const { step } = useStep(stepId)

  return (
    <>
      {showSlidePreview && (
        // TODO: Styling
        <div className="re-basic-box absolute right-20 top-40 z-20 bg-white p-4">
          <Button
            className="w-full"
            onClick={() => setShowSlidePreview(false)}
            startIcon={<XIcon className="h-10"></XIcon>}
            variant={'danger'}
          >
            Vorschau beenden
          </Button>
          <Slide step={step}></Slide>
        </div>
      )}
    </>
  )
}
