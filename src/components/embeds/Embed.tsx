import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { media_type } from '@/src/lib/media/media'
import { useBoundStore } from '@/src/lib/store/store'
import * as React from 'react'
import { PadletEmbed } from './PadletEmbed'
import { SpotifyEmbed } from './SpotifyEmbed'
import { WikipediaEmbed } from './WikipediaEmbed'
import { VideoEmbed } from './VideoEmbeds'
import { SocialMediaEmbed } from './SocialMediaEmbed'
import { GoogleStreetViewEmbed } from './GoogleStreetViewEmbed'
import LamaPollEmbed from './LamaPollEmbed'

export interface EmbedProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDListElement>,
    HTMLDListElement
  > {
  media: media_type | undefined
  options?: object
  width?: string | number
  height?: string | number
}

export function Embed({
  media,
  width = '100%',
  height = '100%',
  options,
}: EmbedProps) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  // supported embed types https://github.com/cookpete/react-player
  const videoEmbedTypes = [
    'YOUTUBE',
    'VIMEO',
    'DAILYMOTION',
    'TWITCH',
    'SOUNDCLOUD',
  ]
  // supported social media embed types https://github.com/justinmahar/react-social-media-embed
  const socialMediaEmbedTypes = ['TWITTER', 'INSTAGRAM', 'TIKTOK', 'FACEBOOK']

  return (
    <>
      {media && videoEmbedTypes.includes(media.type) && (
        <VideoEmbed height={height} url={media.content} width={width} />
      )}
      {media && socialMediaEmbedTypes.includes(media.type) && (
        <SocialMediaEmbed
          height={height}
          type={media.type}
          url={media.content}
          width={width}
        />
      )}
      {media && media.type == 'WIKIPEDIA' && (
        <WikipediaEmbed height={height} url={media.content} width={width} />
      )}
      {media && media.type == 'PADLET' && (
        <PadletEmbed height={height} url={media.content} width={width} />
      )}
      {media && media.type == 'LAMAPOLL' && (
        <LamaPollEmbed height={height} url={media.content} width={width} />
      )}
      {media && media.type == 'SPOTIFY' && (
        <SpotifyEmbed height={height} url={media.content} width={width} />
      )}
      {media && media.type == 'GOOGLESTREETVIEW' && (
        <GoogleStreetViewEmbed
          height={height}
          url={media.content}
          width={width}
        />
      )}
      {media && media.type == 'EXTERNALIMAGE' && (
        <img alt={media.content} src={media.content} />
      )}
      {media == null && <p>Embed not recognized</p>}
    </>
  )
}
