// @ts-nocheck
import * as React from 'react'
import ReactPlayer from 'react-player'
export interface SoundCloudEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  width?: string | number
  height?: string | number
}

export function SoundCloudEmbed({
  url,
  width,
  height,
  ...divProps
}: SoundCloudEmbedProps) {
  return <ReactPlayer height={height} url={url} width={width} />
}
