import { SpotifyEmbed as Spotify } from 'spotify-embed'
import * as React from 'react'
import classNames from 'classnames'
import { EmbedStyle } from './EmbedStyle'

const borderRadius = 0

export interface SpotifyEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  width?: string | number
  height?: string | number
}

export function SpotifyEmbed({
  url,
  width,
  height,
  ...divProps
}: SpotifyEmbedProps) {
  return (
    <div
      {...divProps}
      className={classNames(
        'rsme-embed flex justify-center',
        divProps.className,
      )}
      style={{
        width: width ?? 100,
        maxHeight: height ?? 100,
        borderRadius,
        ...divProps.style,
      }}
    >
      <EmbedStyle />

      <Spotify height={height} src={url} width={width} />
    </div>
  )
}
