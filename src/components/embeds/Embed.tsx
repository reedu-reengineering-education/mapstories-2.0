import { media_type } from '@/src/lib/media/media'
import * as React from 'react'
import { InstagramEmbed } from './InstagramEmbed'
import { PadletEmbed } from './PadletEmbet'
import { TikTokEmbed } from './TikTokEmbed'
import { TwitterEmbed } from './TwitterEmbed'
import { YouTubeEmbed } from './YoutubeEmbed'

export interface EmbedProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDListElement>,
    HTMLDListElement
  > {
  media: media_type
  width?: string | number
  height?: string | number
  linkText?: string
}

export function Embed({
  media,
  width = '100%',
  height = '100%',
  ...divProps
}: EmbedProps) {
  return (
    <div className="h-full w-full">
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
      {media.type == 'padlet' && (
        <PadletEmbed height={height} url={media.url} width={width} />
      )}
      {media.type == 'unknown' && <p>Media not recognized...</p>}
    </div>
  )
}
