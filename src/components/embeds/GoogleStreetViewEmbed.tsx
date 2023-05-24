import * as React from 'react'

export interface GoogleStreetViewEmbed
  extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  width?: string | number
  height?: string | number
}

export function GoogleStreetViewEmbed({
  url,
  width,
  height,
  ...divProps
}: GoogleStreetViewEmbed) {
  return (
    <iframe
      height="450"
      loading="lazy"
      src="https://www.google.com/maps/embed?pb=!4v1684850060713!6m8!1m7!1sB4CNdfuAj3eYBstyT4jJXg!2m2!1d52.53755370098666!2d13.32631205935773!3f256.84717!4f0!5f0.7820865974627469"
      width="600"
    ></iframe>
  )
}
