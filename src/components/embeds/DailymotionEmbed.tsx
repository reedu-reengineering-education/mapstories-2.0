import * as React from 'react'
import ReactPlayer from 'react-player'

export interface DailymotionEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  width?: string | number
  height?: string | number
}

export function DailymotionEmbed({
  url,
  width,
  height,
  ...divProps
}: DailymotionEmbedProps) {
  return <ReactPlayer height={height} url={url} width={width} />
}
