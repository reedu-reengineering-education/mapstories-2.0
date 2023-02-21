import classNames from 'classnames'
import * as React from 'react'
import { DivPropsWithoutRef } from 'react-html-props'
import YouTube, { YouTubeProps } from 'react-youtube'
import { Options } from 'youtube-player/dist/types'
import { EmbedStyle } from './EmbedStyle'

const borderRadius = 0

export interface YouTubeEmbedProps extends DivPropsWithoutRef {
  url: String
  width?: string | number
  height?: string | number
  linkText?: string
  youTubeProps?: YouTubeProps
}

export function YouTubeEmbed({
  url,
  width,
  height,
  youTubeProps,
  ...divProps
}: YouTubeEmbedProps) {
  const [ready, setReady] = React.useState(false)

  const videoIdMatch = url.match(/[?&]v=(.+?)(?:$|[&?])/)?.[1]
  const shortLinkMatch = url.match(/https:\/\/youtu\.be\/(.+?)(?:$|[&?])/)?.[1]
  const embedLinkMatch = url.match(
    /https:\/\/www.youtube(-nocookie)?\.com\/embed\/(.+?)(?:$|[&?])/,
  )?.[2]
  const videoId = videoIdMatch ?? shortLinkMatch ?? embedLinkMatch ?? '00000000'
  const start = +(url.match(/(.+?)(?:$|[&?])start=(\d+)/)?.[2] ?? 0)

  const isPercentageWidth = !!width?.toString().includes('%')
  const isPercentageHeight = !!height?.toString().includes('%')

  let opts: Options = {}
  if (!!start) {
    opts.playerVars = { start }
  }
  if (typeof width !== 'undefined') {
    opts.width = isPercentageWidth ? '100%' : `${width}`
    width = +width * 2
  }
  if (typeof height !== 'undefined') {
    opts.height = isPercentageHeight ? '100%' : `${height}`
  }
  opts = { ...opts, ...youTubeProps?.opts }

  return (
    <div
      {...divProps}
      className={classNames(
        'rsme-embed rsme-youtube-embed',
        divProps.className,
      )}
      style={{
        overflow: 'hidden',
        width: width ?? undefined,
        height: height ?? undefined,
        borderRadius,
        ...divProps.style,
      }}
    >
      <EmbedStyle />
      <div className={classNames(!ready && 'rsme-d-none')}>
        <YouTube
          {...youTubeProps}
          className={youTubeProps?.className ?? 'youtube-iframe'}
          onReady={e => {
            setReady(true)
            if (youTubeProps && youTubeProps.onReady) {
              youTubeProps?.onReady(e)
            }
          }}
          opts={opts}
          videoId={youTubeProps?.videoId ?? videoId}
        />
      </div>
      {/* {!ready && placeholder} */}
    </div>
  )
}
