import * as React from 'react'
import ReactPlayer from 'react-player'

export interface VimeoEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  width?: string | number
  height?: string | number
}

export function VimeoEmbed({
  url,
  width,
  height,
  ...divProps
}: VimeoEmbedProps) {
  return <ReactPlayer height={height} url={url} width={width} />
}
