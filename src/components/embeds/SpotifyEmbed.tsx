import { SpotifyEmbed } from 'spotify-embed'
import * as React from 'react'
import classNames from 'classnames'
import { EmbedStyle } from './EmbedStyle'
import { media_type } from '@/src/lib/media/media'

const borderRadius = 0

export interface SpotifyEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  media: media_type | undefined
  url: string
  width?: string | number
  height?: string | number
  src: string
}

export function SpotifyEmbedUrl({
  url,
  width,
  height,
  ...divProps
}: SpotifyEmbedProps) {
  return (
    <div
      {...divProps}
      className={classNames('rsme-embed', divProps.className)}
      style={{
        width: width ?? 100,
        maxHeight: height ?? 100,
        borderRadius,
        ...divProps.style,
      }}
    >
      <EmbedStyle />

      <SpotifyEmbed height={height} src={url} width={width} />
    </div>
  )
}
