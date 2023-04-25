import * as React from 'react'
import {
  FacebookEmbed,
  InstagramEmbed,
  TikTokEmbed,
  TwitterEmbed,
} from 'react-social-media-embed'

export interface SocialMediaEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  width?: string | number
  height?: string | number
  type: string
}

export function SocialMediaEmbed({
  url,
  width,
  height,
  type,
  ...divProps
}: SocialMediaEmbedProps) {
  switch (type) {
    case 'TWITTER':
      return <TwitterEmbed height={height} url={url} width={width} />
    case 'INSTAGRAM':
      return <InstagramEmbed height={height} url={url} width={width} />
    case 'TIKTOK':
      return <TikTokEmbed height={height} url={url} width={width} />
    case 'FACEBOOK':
      return <FacebookEmbed height={height} url={url} width={width} />
    default:
      return <div>Unsupported social media embed type</div>
  }
}
