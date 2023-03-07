'use client'

import * as React from 'react'
import { SlideContent } from '@prisma/client'
import { media_type, media_types } from '@/src/lib/media/media'
import { Embed } from '../../embeds/Embed'

interface EmbedContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  content: SlideContent
}

export function EmbedContent({ content }: EmbedContentEditProps) {
  function urlToMedia(url: string): media_type {
    // check if url is a valid url with zod
    try {
      // check if url ir a known media url
      for (var i = 0; i < media_types.length; i++) {
        if (url.toString().match(media_types[i].match_str)) {
          const media = { ...media_types[i] }
          media.url = url
          return media
        }
      }
      // return unknown media
      return {
        type: 'unknown',
        name: 'Unknown',
        match_str: / /,
        url: '',
      }
    } catch {
      // return unknown media
      return {
        type: 'unknown',
        name: 'Unknown',
        match_str: / /,
        url: '',
      }
    }
  }

  return (
    <div className="re-data-media-preview">
      {content.media && (
        <Embed height="200" media={urlToMedia(content.media)} width="300" />
      )}
    </div>
  )
}
