import classNames from 'classnames'
import React from 'react'
import { EmbedStyle } from './EmbedStyle'

const embedJsScriptSrc =
  'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2'
const defaultEmbedWidth = 550
const borderRadius = 3

// Embed Stages
const CHECK_SCRIPT_STAGE = 'check-script'
const LOAD_SCRIPT_STAGE = 'load-script'
const CONFIRM_SCRIPT_LOADED_STAGE = 'confirm-script-loaded'
const PROCESS_EMBED_STAGE = 'process-embed'
const CONFIRM_EMBED_SUCCESS_STAGE = 'confirm-embed-success'
const RETRYING_STAGE = 'retrying'
const EMBED_SUCCESS_STAGE = 'embed-success'

export interface FacebookEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The URL to the post. */
  url: String
  width?: string | number
  height?: string | number
}

export function FacebookEmbed({
  url,
  width,
  height,
  ...divProps
}: FacebookEmbedProps) {
  // === === === === === === === === === === === === === === === === === === ===
  // Embed Stages
  // === === === === === === === === === === === === === === === === === === ===
  const [facebookLink, setFacebookLink] = React.useState('')

  const getEmbedUrl = videoId => {
    return `https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/${videoId}`
  }

  const getPostId = url => {
    // Extrahiere die Post-ID aus der Facebook-URL
    const urlParts = url.split('/')
    const postId = urlParts[urlParts.length - 1]
    return postId
  }

  const renderEmbeddedVideo = () => {
    const videoId = getPostId(url)
    const embedUrl = getEmbedUrl(videoId)

    if (videoId && embedUrl) {
      return (
        <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
          <iframe
            allowFullScreen
            height="480px"
            src={url}
            title="Facebook Video"
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
      className={classNames(
        'rsme-embed rsme-facebook-embed',
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
      <div>
        <div>{renderEmbeddedVideo()}</div>
      </div>
      {/* {!ready && placeholder} */}
    </div>
  )
}
