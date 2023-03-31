'use client'

import { SlideContent } from '@prisma/client'
import { TextContent } from './TextContent'
import { TitleContent } from './TitleContent'
import { EmbedContent } from './EmbedContent'
import { MediaContent } from './MediaContent'
type Props = {
  content: SlideContent
}

export function ContentType({ content }: Props) {
  // this function in a switch statement
  // it will return the correct component based on the type of content
  // it will also pass the id of the content to the component
  // so that it can be edited
  // this is a good example of a component that is not a class

  return (
    <div>
      {content.type == 'TITLE' && <TitleContent content={content} />}
      {content.type == 'TEXT' && <TextContent content={content} />}
      {content.type == 'IMAGE' && <MediaContent content={content} />}
      {[
        'YOUTUBE',
        'INSTAGRAM',
        'TIKTOK',
        'FACEBOOK',
        'TWITTER',
        'WIKIPEDIA',
        'PADLET',
      ].includes(content.type) && (
        <EmbedContent content={content}></EmbedContent>
      )}
    </div>
  )
}
