import { MediaType } from '@prisma/client'

export interface MediaPrivacyInfo {
  label: string
  privacyPolicyUrl: string
  requiresConsent: boolean
}

export const mediaPrivacyMap: Partial<Record<MediaType, MediaPrivacyInfo>> = {
  [MediaType.YOUTUBE]: {
    label: 'YouTube',
    privacyPolicyUrl: 'https://policies.google.com/privacy',
    requiresConsent: true,
  },
  [MediaType.SPOTIFY]: {
    label: 'Spotify',
    privacyPolicyUrl: 'https://www.spotify.com/legal/privacy-policy/',
    requiresConsent: true,
  },
  [MediaType.INSTAGRAM]: {
    label: 'Instagram',
    privacyPolicyUrl: 'https://privacycenter.instagram.com/policy/',
    requiresConsent: true,
  },
  [MediaType.TIKTOK]: {
    label: 'TikTok',
    privacyPolicyUrl: 'https://www.tiktok.com/legal/page/eea/privacy-policy/en',
    requiresConsent: true,
  },
  [MediaType.FACEBOOK]: {
    label: 'Facebook',
    privacyPolicyUrl: 'https://www.facebook.com/privacy/policy/',
    requiresConsent: true,
  },
  [MediaType.TWITTER]: {
    label: 'X (Twitter)',
    privacyPolicyUrl: 'https://twitter.com/en/privacy',
    requiresConsent: true,
  },
  [MediaType.SOUNDCLOUD]: {
    label: 'SoundCloud',
    privacyPolicyUrl: 'https://soundcloud.com/pages/privacy',
    requiresConsent: true,
  },
  [MediaType.VIMEO]: {
    label: 'Vimeo',
    privacyPolicyUrl: 'https://vimeo.com/privacy',
    requiresConsent: true,
  },
  [MediaType.DAILYMOTION]: {
    label: 'Dailymotion',
    privacyPolicyUrl: 'https://www.dailymotion.com/legal/privacy',
    requiresConsent: true,
  },
  [MediaType.PADLET]: {
    label: 'Padlet',
    privacyPolicyUrl: 'https://padlet.com/about/privacy',
    requiresConsent: true,
  },
  [MediaType.GOOGLESTREETVIEW]: {
    label: 'Google Street View',
    privacyPolicyUrl: 'https://policies.google.com/privacy',
    requiresConsent: true,
  },
  [MediaType.WIKIPEDIA]: {
    label: 'Wikipedia',
    privacyPolicyUrl: 'https://foundation.wikimedia.org/wiki/Policy:Privacy_policy',
    requiresConsent: true,
  },
  [MediaType.LAMAPOLL]: {
    label: 'Lamapoll',
    privacyPolicyUrl: 'https://www.lamapoll.de/Support/Datenschutz',
    requiresConsent: true,
  },
}

export function getMediaPrivacyInfo(type: MediaType) {
  return mediaPrivacyMap[type] ?? {
    label: type,
    privacyPolicyUrl: '',
    requiresConsent: false,
  }
}