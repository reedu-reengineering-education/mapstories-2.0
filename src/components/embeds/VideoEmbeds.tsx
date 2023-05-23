import * as React from 'react'
import ReactPlayer from 'react-player'

export interface VideoEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  width?: string | number
  height?: string | number
}

export function VideoEmbed({
  url,
  width,
  height,
  ...divProps
}: VideoEmbedProps) {
  return <ReactPlayer controls={true} height={height} url={url} width={width} />
}
