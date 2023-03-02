import classNames from 'classnames'
import * as React from 'react'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import { TwitterTweetEmbedProps } from 'react-twitter-embed/dist/components/TwitterTweetEmbed'
import { EmbedStyle } from './EmbedStyle'

const borderRadius = 12

export interface TwitterEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url: String
  width?: string | number
  height?: string | number
  twitterTweetEmbedProps?: TwitterTweetEmbedProps
}

export function TwitterEmbed({
  url,
  width,
  height,
  twitterTweetEmbedProps,
  ...divProps
}: TwitterEmbedProps) {
  const tweetId = url.substring(url.lastIndexOf('/') + 1).replace(/[?].*$/, '')
  if (typeof width !== 'undefined') {
    width = +width * 2
  }
  return (
    <div
      {...divProps}
      className={classNames(
        'rsme-embed rsme-twitter-embed',
        divProps.className,
      )}
      style={{
        overflow: 'auto',
        width: width ?? undefined,
        height: height ?? undefined,
        borderRadius,
        ...divProps.style,
      }}
    >
      <EmbedStyle />
      <TwitterTweetEmbed tweetId={tweetId} {...twitterTweetEmbedProps} />
    </div>
  )
}
