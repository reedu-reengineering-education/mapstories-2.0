import classNames from 'classnames'
import React from 'react'
import { Subs } from 'react-sub-unsub'
import { Frame, useFrame } from './useFrame'
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
  scriptLoadDisabled?: boolean
  retryDelay?: number
  retryDisabled?: boolean
  frame?: Frame
  debug?: boolean
}

export function TikTokEmbed({
  url,
  width,
  height,
  scriptLoadDisabled = false,
  retryDelay = 5000,
  retryDisabled = false,
  frame = undefined,
  ...divProps
}: TikTokEmbedProps) {
  const [stage, setStage] = React.useState(PROCESS_EMBED_STAGE)
  const frm = useFrame(frame)

  // === === === === === === === === === === === === === === === === === === ===
  // Embed Stages
  // === === === === === === === === === === === === === === === === === === ===

  // Process Embed Stage
  React.useEffect(() => {
    if (stage === PROCESS_EMBED_STAGE) {
      if (frm.document && !scriptLoadDisabled) {
        const scriptId = 'tiktok-embed-script'
        const prevScript = frm.document.getElementById(scriptId)
        if (prevScript) {
          prevScript.remove()
        }
        const scriptElement = frm.document.createElement('script')
        scriptElement.setAttribute('src', `${embedJsScriptSrc}?t=${Date.now()}`)
        scriptElement.setAttribute('id', scriptId)
        frm.document.head.appendChild(scriptElement)
        setStage(CONFIRM_EMBED_SUCCESS_STAGE)
      }
    }
  }, [scriptLoadDisabled, stage, frm.document])

  // Confirm Embed Success Stage
  React.useEffect(() => {
    const subs = new Subs()
    if (stage === CONFIRM_EMBED_SUCCESS_STAGE) {
      subs.setInterval(() => {
        if (frm.document) {
          const preEmbedElement = frm.document.getElementById(
            'tiktok-media-pre-embed',
          )
          if (!preEmbedElement) {
            setStage(EMBED_SUCCESS_STAGE)
          }
        }
      }, 1)
      if (!retryDisabled) {
        subs.setTimeout(() => {
          setStage(RETRYING_STAGE)
        }, retryDelay)
      }
    }
    return subs.createCleanup()
  }, [retryDelay, retryDisabled, stage, frm.document])

  // Retrying Stage
  React.useEffect(() => {
    if (stage === RETRYING_STAGE) {
      // This forces the embed container to remount
      setStage(PROCESS_EMBED_STAGE)
    }
  }, [stage])

  // END Embed Stages
  // === === === === === === === === === === === === === === === === === === ===

  // Format: https://www.tiktok.com/@epicgardening/video/7055411162212633903?is_copy_url=1&is_from_webapp=v1
  const embedId = url.replace(/[?].*$/, '').replace(/^.+\//, '')

  if (typeof width !== 'undefined') {
    width = +width * 2
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
      <div className="tiktok-embed-container">
        <blockquote
          cite={url as string}
          className="tiktok-embed"
          data-video-id={embedId}
        >
          {/* {!ready && placeholder} */}
          <div id="tiktok-media-pre-embed" style={{ display: 'none' }}>
            &nbsp;
          </div>
        </blockquote>
      </div>
    </div>
  )
}
