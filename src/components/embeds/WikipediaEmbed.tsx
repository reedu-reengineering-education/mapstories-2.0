import classNames from 'classnames'
import * as React from 'react'
import { EmbedStyle } from './EmbedStyle'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'

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
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'embeds')

  const [ready, setReady] = React.useState(false)
  const [wikipediaData, setWikipediaData] = React.useState(null)
  // when component is mounted use url to fetch the preview of the article
  React.useEffect(() => {
    fetch(urlPreview)
      .then(response => response.json())
      .then(data => setWikipediaData(data))
  }, [])

  // Example URL: https://en.wikipedia.org/wiki/Wikipedia
  // extract language and put it in the new url
  // https://[].wikipedia.org/api/rest_v1/page/summary/[]
  const language = url.match(
    /https:\/\/(.+?).wikipedia.org\/wiki\/(.+?)(?:$|[&?])/,
  )?.[1]
  const article = url.match(
    /https:\/\/(.+?).wikipedia.org\/wiki\/(.+?)(?:$|[&?])/,
  )?.[2]
  const urlPreview = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${article}`

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
      <div>
        {wikipediaData ? <img src={wikipediaData.thumbnail.source} /> : null}
        {wikipediaData ? wikipediaData.extract : null}
        {/* show a button which links to the original article */}
        {wikipediaData ? (
          <a
            className="text-blue-500 hover:text-blue-700"
            href={wikipediaData.content_urls.desktop.page}
          >
            {t('readMore')}
          </a>
        ) : null}
      </div>

      {/* {!ready && placeholder} */}
    </div>
  )
}
