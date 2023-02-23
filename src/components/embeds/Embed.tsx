import { media_type } from '@/src/lib/media/media'
import * as React from 'react'
import { DivPropsWithoutRef } from 'react-html-props'
import { InstagramEmbed } from './InstagramEmbed'
import { TwitterEmbed } from './TwitterEmbed'
import { YouTubeEmbed } from './YoutubeEmbed'

export interface EmbedProps extends DivPropsWithoutRef {
  media: media_type
  width?: string | number
  height?: string | number
  linkText?: string
}

export function Embed({ media, width, height, ...divProps }: EmbedProps) {
  return (
    <>
      {media.type == 'youtube' && (
        <YouTubeEmbed height="200" url={media.url} width="300" />
      )}
      {media.type == 'twitter' && (
        <TwitterEmbed height="50" url={media.url} width="200" />
      )}
      {media.type == 'instagram' && (
        <InstagramEmbed height="50" url={media.url} width="200" />
      )}
      {media.type == 'unknown' && <p>Media not recognized...</p>}
    </>
  )
}
