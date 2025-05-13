'use client'

import { SlideContent } from '@prisma/client'
import { TitleContentEdit } from './TitleContentEdit'
import { TextContentEdit } from './TextContentEdit'

interface ContentEditFactoryProps {
  stepItem: SlideContent
  setItem: any
  setContentType?: any
  setShowModal?: any
}

export function ContentEditFactory({
  stepItem,
  setItem,
  setContentType,
  setShowModal,
}: ContentEditFactoryProps) {
  switch (stepItem.type) {
    case 'TITLE':
      return (
        <TitleContentEdit
          setContentType={setContentType}
          setItem={setItem}
          setShowModal={setShowModal}
          stepItem={stepItem}
        />
      )
    case 'TEXT':
      return (
        <TextContentEdit
          setContentType={setContentType}
          setItem={setItem}
          setShowModal={setShowModal}
          stepItem={stepItem}
        />
      )
    // case 'IMAGE' || 'VIDEO':
    //   return (
    //     <MediaContentEdit
    //       setShowModal={setShowModal}
    //       stepItem={stepItem}
    //       storyStepId={storyStepId}
    //     />
    //   )
    // case 'EXTERNALIMAGE':
    //   return (
    //     <MediaContentEdit
    //       setShowModal={setShowModal}
    //       stepItem={stepItem}
    //       storyStepId={storyStepId}
    //     />
    //   )
    // case 'AUDIO':
    //   return (
    //     <MediaContentEdit
    //       setShowModal={setShowModal}
    //       stepItem={stepItem}
    //       storyStepId={storyStepId}
    //     />
    //   )
    // case 'VIDEO':
    //   return (
    //     <MediaContentEdit
    //       setShowModal={setShowModal}
    //       stepItem={stepItem}
    //       storyStepId={storyStepId}
    //     />
    //   )
    default:
      return <></>
  }
}
