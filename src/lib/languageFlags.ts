export type LanguageInfo = {
  code: string
  flag: string
  label: string
}

// Content languages a story can be authored/translated in. Independent of the
// website UI languages (src/app/i18n/settings). Ordered roughly by how widely
// they are used on the internet; labels are the languages' own names.
export const availableStoryLanguages: LanguageInfo[] = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'ar', flag: '🇸🇦', label: 'العربية' },
  { code: 'pt', flag: '🇵🇹', label: 'Português' },
  { code: 'id', flag: '🇮🇩', label: 'Bahasa Indonesia' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'ja', flag: '🇯🇵', label: '日本語' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
  { code: 'fa', flag: '🇮🇷', label: 'فارسی' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
  { code: 'hi', flag: '🇮🇳', label: 'हिन्दी' },
  { code: 'th', flag: '🇹🇭', label: 'ไทย' },
  { code: 'uk', flag: '🇺🇦', label: 'Українська' },
]

export const storyLanguages: Record<string, LanguageInfo> = Object.fromEntries(
  availableStoryLanguages.map(l => [l.code, l]),
)

export function isStoryLanguage(code: string) {
  return code in storyLanguages
}

export function getLanguageInfo(code: string): LanguageInfo {
  return (
    storyLanguages[code] ?? { code, flag: '🌐', label: code.toUpperCase() }
  )
}
