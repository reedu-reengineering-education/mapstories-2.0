import classNames from 'classnames'
import React from 'react'

export interface EmbedStyleProps
  extends React.StyleHTMLAttributes<HTMLStyleElement> {}

export function EmbedStyle({ ...styleProps }: EmbedStyleProps) {
  return (
    <style
      {...styleProps}
      className={classNames(styleProps.className)}
      style={{ ...styleProps.style }}
    >
      {`
        .rsme-embed .rsme-d-none {
          display: none;
        }
    
        .rsme-embed .twitter-tweet {
          margin: 0 !important;
        }
    
        .rsme-embed blockquote {
          margin: 0 !important;
          padding: 0 !important;
        }

        .rsme-embed.rsme-facebook-embed .fb-post iframe {
          width: 100% !important;
        }

        .rsme-embed.rsme-facebook-embed .fb-post span {
          width: 100% !important;
        }
      `}
    </style>
  )
}
