import classNames from 'classnames'
import * as React from 'react'
import ReactPlayer from 'react-player'
import { EmbedStyle } from './EmbedStyle'

const borderRadius = 0

export interface DailyMotionEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
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
        overflow: 'auto',
        width: width ?? undefined,
        maxHeight: height ?? undefined,
        borderRadius,
        ...divProps.style,
      }}
    >
      <EmbedStyle />

      <ReactPlayer video={url} width={400} />
    </div>
  )
}
