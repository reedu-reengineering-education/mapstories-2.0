'use client'

import { TextContentEdit } from './TextContentEdit'
import { TitleContentEdit } from './TitleContentEdit'
import { EmbedContentEdit } from './EmbedContentEdit'
import { SlideContent } from '@prisma/client'

interface ContentEditFactoryProps {
  stepItem: SlideContent
  storyStepId: string
  lng: string
}

export function ContentEditFactory({
  stepItem,
  storyStepId,
  lng,
}: ContentEditFactoryProps) {
  switch (stepItem.type) {
    case 'TITLE':
      return (
        <TitleContentEdit
          lng={lng}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
    case 'TEXT':
      return (
        <TextContentEdit
          lng={lng}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
    default:
      return (
        <EmbedContentEdit
          lng={lng}
          stepItem={stepItem}
          storyStepId={storyStepId}
        />
      )
  }
}
