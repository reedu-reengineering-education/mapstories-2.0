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
  return (
    <ReactPlayer
      controls={true}
      height="100%"
      style={{ aspectRatio: '4/3' }}
      url={url}
      width="80%"
    />
  )
}
