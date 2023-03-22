import { media_type, media_types } from '../lib/media/media'

export function urlToMedia(url: string): media_type | undefined {
  // TODO: check if url is a valid url with zod

  if (!url) {
    return
  }

  // check if url ir a known media url
  for (var i = 0; i < media_types.length; i++) {
    if (url.toString().match(media_types[i].match_str)) {
      const media = { ...media_types[i] }
      media.content = url
      return media
    }
  }
}
