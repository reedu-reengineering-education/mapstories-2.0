import { media_type, media_types } from '../lib/media/media'

export function urlToMedia(url: string): media_type | null {
  // check if url is a valid url with zod
  try {
    // check if url ir a known media url
    for (var i = 0; i < media_types.length; i++) {
      if (url.toString().match(media_types[i].match_str)) {
        const media = { ...media_types[i] }
        media.content = url
        return media
      }
    }
    // return unknown media
    return null
  } catch {
    // return unknown media
    return null
  }
}
