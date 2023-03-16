'use client'

import { Modal } from '@/src/components/Modal'
import { SlideContent, StoryStep } from '@prisma/client'
import { Slide } from '../../Viewer/Slide'

type Props = {
  trigger: React.ReactElement
  step:
    | (StoryStep & {
        content?: SlideContent[] | undefined
      })
    | undefined
}

export default function SlidePreviewModal({ trigger, step }: Props) {
  return (
    <>
      <Modal title={''} trigger={trigger}>
        <Modal.Content>
          <Slide step={step}></Slide>
        </Modal.Content>
      </Modal>
    </>
  )
}
