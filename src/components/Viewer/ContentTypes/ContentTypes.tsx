'use client'

import { SlideContent } from '@prisma/client'
import { TextContent } from './TextContent'
import { TitleContent } from './TitleContent'
import { EmbedContent } from './EmbedContent'

type Props = {
  content: SlideContent
}

export function ContentType({ content }: Props) {
  if (content.type == 'TITLE') {
    return <TitleContent content={content} />
  }

  if (content.type === 'TEXT') {
    return <TextContent content={content} />
  }

  return <EmbedContent content={content}></EmbedContent>
}
