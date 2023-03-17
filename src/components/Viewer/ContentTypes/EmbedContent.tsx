'use client'

import * as React from 'react'
import { SlideContent } from '@prisma/client'
import { media_type, media_types } from '@/src/lib/media/media'
import { Embed } from '../../embeds/Embed'

interface EmbedContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  content: SlideContent
}

export function EmbedContent({ content }: EmbedContentEditProps) {
  function urlToMedia(url: string): media_type | null {
    // check if url is a valid url with zod
    try {
      // check if url ir a known media url
      for (var i = 0; i < media_types.length; i++) {
        if (url.toString().match(media_types[i].match_str)) {
          const media = { ...media_types[i] }
          media.content = url
          return media
        }
      }
      // return unknown media
      return null
    } catch {
      // return unknown media
      return null
    }
  }

  return (
    <div className="re-data-media-preview">
      {content.content && (
        <Embed
          height="65vh"
          media={urlToMedia(content.content)}
          options={content.options as object}
        />
      )}
    </div>
  )
}
