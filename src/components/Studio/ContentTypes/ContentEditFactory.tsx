'use client'

import { TextContentEdit } from './TextContentEdit'
import { TitleContentEdit } from './TitleContentEdit'
import { EmbedContentEdit } from './EmbedContentEdit'
import { SlideContent } from '@prisma/client'
import { MediaContentEdit } from './MediaContentType'

interface ContentEditFactoryProps {
  stepItem: SlideContent
  storyStepId: string
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>
}

export function ContentEditFactory({
  stepItem,
  storyStepId,
  setShowModal,
}: ContentEditFactoryProps) {
  switch (stepItem.type) {
    case 'TITLE':
      return (
        <TitleContentEdit
          setShowModal={setShowModal}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
    case 'TEXT':
      return (
        <TextContentEdit
          setShowModal={setShowModal}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
    case 'IMAGE' || 'VIDEO':
      return (
        <MediaContentEdit
          setShowModal={setShowModal}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
    case 'EXTERNALIMAGE':
      return (
        <MediaContentEdit
          setShowModal={setShowModal}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
    case 'AUDIO':
      return (
        <MediaContentEdit
          setShowModal={setShowModal}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
    case 'VIDEO':
      return (
        <MediaContentEdit
          setShowModal={setShowModal}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
    default:
      return (
        <EmbedContentEdit
          setShowModal={setShowModal}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
  }
}
