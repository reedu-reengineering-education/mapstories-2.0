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
  return (
    <div className="py-2">
      {content.type == 'TITLE' && <TitleContent content={content} />}
      {content.type == 'TEXT' && <TextContent content={content} />}
      {content.type == 'IMAGE' && <MediaContent content={content} />}
      {content.type == 'AUDIO' && <MediaContent content={content} />}
      {content.type == 'VIDEO' && <MediaContent content={content} />}
      {content.type == 'EXTERNALIMAGE' && <MediaContent content={content} />}
      {[
        'YOUTUBE',
        'INSTAGRAM',
        'TIKTOK',
        'FACEBOOK',
        'TWITTER',
        'WIKIPEDIA',
        'PADLET',
        'SPOTIFY',
        'SOUNDCLOUD',
        'VIMEO',
        'DAILYMOTION',
      ].includes(content.type) && (
        <EmbedContent content={content}></EmbedContent>
      )}
    </div>
  )
}
