'use client'

import { TextContentEdit } from './TextContentEdit'
import { TitleContentEdit } from './TitleContentEdit'
import { EmbedContentEdit } from './EmbedContentEdit'
import { SlideContent } from '@prisma/client'

interface ContentEditFactoryProps {
  stepItem: SlideContent
  storyStepId: string
}

export function ContentEditFactory({
  stepItem,
  storyStepId,
}: ContentEditFactoryProps) {
  switch (stepItem.type) {
    case 'TITLE':
      return <TitleContentEdit stepItem={stepItem} storyStepId={storyStepId} />
    case 'TEXT':
      return <TextContentEdit stepItem={stepItem} storyStepId={storyStepId} />
    default:
      return <EmbedContentEdit stepItem={stepItem} storyStepId={storyStepId} />
  }
}
