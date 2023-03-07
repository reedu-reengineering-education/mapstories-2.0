'use client'

import { SlideContent } from '@prisma/client'
import { TextContent } from './TextContent'
import { TitleContent } from './TitleContent'
import { EmbedContent } from './EmbedContent'
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
      {content.title && <TitleContent content={content} />}
      {content.text && <TextContent content={content} />}
      {content.media && <EmbedContent content={content}></EmbedContent>}
    </div>
  )
}
