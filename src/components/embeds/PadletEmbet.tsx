import classNames from 'classnames'
import * as React from 'react'
import { EmbedStyle } from './EmbedStyle'

const minPlaceholderWidth = 250
const maxPlaceholderWidth = 550
const defaultPlaceholderHeight = 550
const borderRadius = 8

export interface PadletEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  url: String
  postUrl?: string
  width?: string | number
  height?: string | number
}

export function PadletEmbed({
  url,
  postUrl,
  width,
  height = 500,
  ...divProps
}: PadletEmbedProps) {
  const [ready, setReady] = React.useState(false)

  // Example URL: https://padlet.com/VamosMuenster/fast-fashion-b53gh89jridi6gie
  const urlWithNoQuery = url.replace(/[?].*$/, '')
  const cleanUrlWithEndingSlash = `${urlWithNoQuery}${
    urlWithNoQuery.endsWith('/') ? '' : '/'
  }`

  return (
    <div
      {...divProps}
      className={classNames(
        'rsme-embed rsme-pinterest-embed',
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
      <iframe
        className={classNames('pinterest-post', !ready && 'rsme-d-none')}
        height="100%"
        onLoad={() => setReady(true)}
        src={cleanUrlWithEndingSlash}
        width="100%"
      ></iframe>
      {/* {!ready && placeholder} */}
    </div>
  )
}
