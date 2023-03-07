import classNames from 'classnames'
import * as React from 'react'
import { Subs } from 'react-sub-unsub'
import { Frame, useFrame } from './useFrame'
import { EmbedStyle } from './EmbedStyle'

const embedJsScriptSrc = '//www.instagram.com/embed.js'
const borderRadius = 3

// Embed Stages
const CHECK_SCRIPT_STAGE = 'check-script'
const LOAD_SCRIPT_STAGE = 'load-script'
const CONFIRM_SCRIPT_LOADED_STAGE = 'confirm-script-loaded'
const PROCESS_EMBED_STAGE = 'process-embed'
const CONFIRM_EMBED_SUCCESS_STAGE = 'confirm-embed-success'
const RETRYING_STAGE = 'retrying'
const EMBED_SUCCESS_STAGE = 'embed-success'

export interface InstagramEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url: String
  width?: string | number
  height?: string | number
  linkText?: string
  /** Deprecated -- This has no effect. Captions are always visible due to https://github.com/justinmahar/react-social-media-embed/issues/26 */
  captioned?: boolean
  scriptLoadDisabled?: boolean
  retryDelay?: number
  retryDisabled?: boolean
  igVersion?: string
  frame?: Frame
  debug?: boolean
}

export function InstagramEmbed({
  url,
  width,
  height,
  scriptLoadDisabled = false,
  retryDelay = 5000,
  retryDisabled = false,
  igVersion = '14',
  frame = undefined,
  ...divProps
}: InstagramEmbedProps) {
  const [stage, setStage] = React.useState(CHECK_SCRIPT_STAGE)
  const frm = useFrame(frame)

  // === === === === === === === === === === === === === === === === === === ===
  // Embed Stages
  // === === === === === === === === === === === === === === === === === === ===

  // Check Script Stage
  React.useEffect(() => {
    if (stage === CHECK_SCRIPT_STAGE) {
      if ((frm.window as any)?.instgrm?.Embeds?.process) {
        setStage(PROCESS_EMBED_STAGE)
      } else if (!scriptLoadDisabled) {
        setStage(LOAD_SCRIPT_STAGE)
      } else {
        // TODO error handling
        // console.error('Instagram embed script not found. Unable to process Instagram embed:', url);
      }
    }
  }, [scriptLoadDisabled, stage, url, frm.window])

  // Load Script Stage
  React.useEffect(() => {
    if (stage === LOAD_SCRIPT_STAGE) {
      if (frm.document) {
        const scriptElement = frm.document.createElement('script')
        scriptElement.setAttribute('src', embedJsScriptSrc)
        frm.document.head.appendChild(scriptElement)
        setStage(CONFIRM_SCRIPT_LOADED_STAGE)
      }
    }
  }, [stage, frm.document])

  // Confirm Script Loaded Stage
  React.useEffect(() => {
    const subs = new Subs()
    if (stage === CONFIRM_SCRIPT_LOADED_STAGE) {
      subs.setInterval(() => {
        if ((frm.window as any)?.instgrm?.Embeds?.process) {
          setStage(PROCESS_EMBED_STAGE)
        }
      }, 1)
    }
    return subs.createCleanup()
  }, [stage, frm.window])

  // Process Embed Stage
  React.useEffect(() => {
    if (stage === PROCESS_EMBED_STAGE) {
      const process = (frm.window as any)?.instgrm?.Embeds?.process
      if (process) {
        process()
        setStage(CONFIRM_EMBED_SUCCESS_STAGE)
      } else {
        // TODO error handling
        // console.error('Instagram embed script not found. Unable to process Instagram embed:', url);
      }
    }
  }, [stage, frm.window, url])

  // Confirm Embed Success Stage
  React.useEffect(() => {
    const subs = new Subs()
    if (stage === CONFIRM_EMBED_SUCCESS_STAGE) {
      subs.setInterval(() => {
        if (frm.document) {
          const preEmbedElement = frm.document.getElementById(
            'instagram-media-pre-embed',
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

  const urlWithNoQuery = url.replace(/[?].*$/, '')
  const cleanUrlWithEndingSlash = `${urlWithNoQuery}${
    urlWithNoQuery.endsWith('/') ? '' : '/'
  }`

  const isPercentageWidth = !!width?.toString().includes('%')

  if (typeof width !== 'undefined') {
    width = +width * 2
  }

  return (
    <div
      {...divProps}
      className={classNames(
        'rsme-embed rsme-instagram-embed',
        divProps.className,
      )}
      style={{
        overflow: 'auto',
        width: width ?? undefined,
        maxHeight: height ?? undefined,
        borderRadius,
        ...divProps.style,
      }}
    >
      <EmbedStyle />
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={`${cleanUrlWithEndingSlash}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version={igVersion}
        data-width={isPercentageWidth ? '100%' : width ?? undefined}
        style={{
          width: 'calc(100% - 2px)',
        }}
      >
        {/* {!ready && placeholder} */}
        <div
          className="instagram-media-pre-embed rsme-d-none"
          id="instagram-media-pre-embed"
        >
          &nbsp;
        </div>
      </blockquote>
    </div>
  )
}
