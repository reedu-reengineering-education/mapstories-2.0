import { media_type } from '@/src/lib/media/media'
import * as React from 'react'
import { DivPropsWithoutRef } from 'react-html-props'
import { InstagramEmbed } from './InstagramEmbed'
import { TikTokEmbed } from './TikTokEmbed'
import { TwitterEmbed } from './TwitterEmbed'
import { YouTubeEmbed } from './YoutubeEmbed'

export interface EmbedProps extends DivPropsWithoutRef {
  media: media_type
  width?: string | number
  height?: string | number
  linkText?: string
}

export function Embed({ media, width='300', height='50', ...divProps }: EmbedProps) {
  return (
    <>
      {media.type == 'youtube' && (
        <YouTubeEmbed height={height} url={media.url} width={width} />
      )}
      {media.type == 'twitter' && (
        <TwitterEmbed height={height} url={media.url} width={width} />
      )}
      {media.type == 'instagram' && (
        <InstagramEmbed height={height} url={media.url} width={width} />
      )}
      {media.type == 'tiktok' && (
        <TikTokEmbed height={height} url={media.url} width={width} />
      )}
      {media.type == 'unknown' && <p>Media not recognized...</p>}
    </>
  )
}
