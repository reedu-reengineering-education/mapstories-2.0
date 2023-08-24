import { de, enUS, es, fr } from 'date-fns/locale'

export function getDateFnsLocale(lng: string) {
  switch (lng) {
    case 'en':
      return enUS
    case 'de':
      return de
    case 'fr':
      return fr
    case 'es':
      return es
    default:
      return enUS
  }
}
