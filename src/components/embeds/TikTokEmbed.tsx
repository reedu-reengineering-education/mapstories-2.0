import classNames from 'classnames'
import React from 'react'
import { EmbedStyle } from './EmbedStyle'

const embedJsScriptSrc = 'https://www.tiktok.com/embed.js'
const borderRadius = 8

// Embed Stages
const PROCESS_EMBED_STAGE = 'process-embed'
const CONFIRM_EMBED_SUCCESS_STAGE = 'confirm-embed-success'
const RETRYING_STAGE = 'retrying'
const EMBED_SUCCESS_STAGE = 'embed-success'

export interface TikTokEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  url: String
  width?: string | number
  height?: string | number
}

export function TikTokEmbed({
  url,
  width,
  height,
  ...divProps
}: TikTokEmbedProps) {
  const getVideoId = (link: String) => {
    const linkParts = link.split('/')
    const videoId = linkParts[linkParts.length - 1]
    return videoId
  }

  const getEmbedUrl = (videoId: String) => {
    return `https://www.tiktok.com/embed/v2/${videoId}`
  }

  const renderEmbeddedVideo = () => {
    const videoId = getVideoId(url)
    const embedUrl = getEmbedUrl(videoId)
    if (videoId && embedUrl) {
      return (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <iframe
            allowFullScreen
            height="680px"
            src={embedUrl}
            title="TikTok Video"
            width="100%"
          />
        </div>
      )
    }

    return null
  }

  return (
    <div
      {...divProps}
      className={classNames('rsme-embed rsme-tiktok-embed', divProps.className)}
      style={{
        overflow: 'auto',
        width: width ?? undefined,
        maxHeight: height ?? undefined,
        borderRadius,
        ...divProps.style,
      }}
    >
      <EmbedStyle />
      <div>{renderEmbeddedVideo()}</div>
    </div>
  )
}
