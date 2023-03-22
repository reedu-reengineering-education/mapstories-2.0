import { media_type } from '@/src/lib/media/media'
import * as React from 'react'
import { FacebookEmbed } from './FacebookEmbed'
import { InstagramEmbed } from './InstagramEmbed'
import { PadletEmbed } from './PadletEmbed'
import { TikTokEmbed } from './TikTokEmbed'
import { TwitterEmbed } from './TwitterEmbed'
import { WikipediaEmbed } from './WikipediaEmbed'
import { YouTubeEmbed } from './YoutubeEmbed'
import { DailyMotionEmbed } from './DailymotionEmbed'

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

export function Embed({ media, width = '100%', height = '100%' }: EmbedProps) {
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
      {media.type == 'facebook' && (
        <FacebookEmbed height={height} url={media.url} width={width} />
      )}
      {media.type == 'wikipedia' && (
        <WikipediaEmbed height={height} url={media.url} width={width} />
      )}
      {media.type == 'Dailymotion' && (
        <DailyMotionEmbed height={height} url={media.url} width={width} />
      )}
      {media.type == 'unknown' && <p>Media not recognized...</p>}
    </div>
  )
}
