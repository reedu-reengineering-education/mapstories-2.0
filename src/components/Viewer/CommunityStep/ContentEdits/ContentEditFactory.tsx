'use client'

import { SlideContent } from '@prisma/client'
import { TitleContentEdit } from './TitleContentEdit'
import { useEffect } from 'react'

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
  useEffect(() => {
    console.log('ContentEditFactoryProps', stepItem)
  }, [])
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
    // case 'TEXT':
    //   return (
    //     <TextContentEdit
    //       setShowModal={setShowModal}
    //       stepItem={stepItem}
    //       storyStepId={storyStepId}
    //     />
    //   )
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
    // default:
    //   return (
    //     <EmbedContentEdit
    //       setShowModal={setShowModal}
    //       stepItem={stepItem}
    //       storyStepId={storyStepId}
    //     />
    //   )
  }
}
