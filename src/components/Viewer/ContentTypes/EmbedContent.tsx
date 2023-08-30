'use client'

import * as React from 'react'
import { SlideContent } from '@prisma/client'
import { Embed } from '../../embeds/Embed'
import { urlToMedia } from '@/src/helper/urlToMedia'

interface EmbedContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  content: SlideContent
}

export function EmbedContent({ content }: EmbedContentEditProps) {
  return (
    <div className="re-data-media-preview">
      {content.content && (
        <Embed
          media={urlToMedia(content.content)}
          options={content.options as object}
        />
      )}
    </div>
  )
}
