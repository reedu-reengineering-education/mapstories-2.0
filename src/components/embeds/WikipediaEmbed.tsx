import classNames from 'classnames'
import * as React from 'react'
import { EmbedStyle } from './EmbedStyle'

const borderRadius = 8

export interface WikipediaEmbedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url: String
  width?: string | number
  height?: string | number
}

// TODO: redesign embedding. I dont think it should show the whole article. Maybe just the abstract? or certain chapters?

export function WikipediaEmbed({
  url,
  width,
  height = 500,
  ...divProps
}: WikipediaEmbedProps) {
  const [ready, setReady] = React.useState(false)

  // Example URL: https://en.wikipedia.org/wiki/Wikipedia
  const urlWithNoQuery = url.replace(/[?].*$/, '')

  return (
    <div
      {...divProps}
      className={classNames(
        'rsme-embed rsme-wikipedia-embed',
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
        className={classNames('wikipedia-post', !ready && 'rsme-d-none')}
        height="100%"
        onLoad={() => setReady(true)}
        src={urlWithNoQuery}
        width="100%"
      ></iframe>
      {/* {!ready && placeholder} */}
    </div>
  )
}
