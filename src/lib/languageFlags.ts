import { languages } from '@/src/app/i18n/settings'

export type LanguageInfo = {
  code: string
  flag: string
  label: string
}

// Content languages a story can be authored in. Mirrors the website i18n
// languages but is a separate concept (story content vs. UI language).
export const storyLanguages: Record<string, LanguageInfo> = {
  de: { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  en: { code: 'en', flag: '🇬🇧', label: 'English' },
  es: { code: 'es', flag: '🇪🇸', label: 'Español' },
  fr: { code: 'fr', flag: '🇫🇷', label: 'Français' },
}

export const availableStoryLanguages: LanguageInfo[] = languages.map(
  code =>
    storyLanguages[code] ?? { code, flag: '🌐', label: code.toUpperCase() },
)

export function getLanguageInfo(code: string): LanguageInfo {
  return (
    storyLanguages[code] ?? { code, flag: '🌐', label: code.toUpperCase() }
  )
}
