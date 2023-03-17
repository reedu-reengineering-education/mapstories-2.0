import { media_type } from '@/src/lib/media/media'
import * as React from 'react'
import { FacebookEmbed } from './FacebookEmbed'
import { InstagramEmbed } from './InstagramEmbed'
import { PadletEmbed } from './PadletEmbed'
import { TikTokEmbed } from './TikTokEmbed'
import { TwitterEmbed } from './TwitterEmbed'
import { WikipediaEmbed } from './WikipediaEmbed'
import { YouTubeEmbed } from './YoutubeEmbed'

export interface EmbedProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDListElement>,
    HTMLDListElement
  > {
  media: media_type | null
  options?: object
  width?: string | number
  height?: string | number
  linkText?: string
}

export function Embed({
  media,
  width = '100%',
  height = '100%',
  options,
}: EmbedProps) {
  return (
    <div className="h-full w-full">
      {media && media.type == 'YOUTUBE' && (
        <YouTubeEmbed
          height={height}
          options={options as { autoplay: boolean }}
          url={media.content}
          width={width}
        />
      )}
      {media && media.type == 'TWITTER' && (
        <TwitterEmbed height={height} url={media.content} width={width} />
      )}
      {media && media.type == 'INSTAGRAM' && (
        <InstagramEmbed height={height} url={media.content} width={width} />
      )}
      {media && media.type == 'TIKTOK' && (
        <TikTokEmbed height={height} url={media.content} width={width} />
      )}
      {media && media.type == 'PADLET' && (
        <PadletEmbed height={height} url={media.content} width={width} />
      )}
      {media && media.type == 'FACEBOOK' && (
        <FacebookEmbed height={height} url={media.content} width={width} />
      )}
      {media && media.type == 'WIKIPEDIA' && (
        <WikipediaEmbed height={height} url={media.content} width={width} />
      )}
      {media == null && <p>Media not recognized...</p>}
    </div>
  )
}
