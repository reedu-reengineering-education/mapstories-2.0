import { z } from 'zod'
import { media_type, media_types } from '../lib/media/media'

export function urlToMedia(url: string): media_type {
  // check if url is a valid url with zod
  try {
    z.string().url().parse(url)

    // check if url ir a known media url
    for (var i = 0; i < media_types.length; i++) {
      if (url.toString().match(media_types[i].match_str)) {
        const media = { ...media_types[i] }
        media.url = url
        return media
      }
    }
    // return unknown media
    return {
      type: 'unknown',
      name: 'Unknown',
      match_str: / /,
      url: '',
    }
  } catch {
    // return unknown media
    return {
      type: 'unknown',
      name: 'Unknown',
      match_str: / /,
      url: '',
    }
  }
}
