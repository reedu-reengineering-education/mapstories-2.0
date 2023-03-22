import * as React from 'react'
import classNames from 'classnames'
import ReactPlayer from 'react-player'
import { EmbedStyle } from './EmbedStyle'

const borderRadius = 0

export interface DailyMotionEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url: String
  width?: string | number
  height?: string | number
}

export function DailyMotionEmbed({
  url,
  width,
  height,
  ...divProps
}: DailyMotionEmbedProps) {
  return (
    <div
      {...divProps}
      className={classNames('rsme-embed', divProps.className)}
      style={{
        overflow: '400',
        width: width ?? 400,
        maxHeight: height ?? 400,
        borderRadius,
        ...divProps.style,
      }}
    >
      <EmbedStyle />

      <ReactPlayer video={url} width={400} />
    </div>
  )
}
