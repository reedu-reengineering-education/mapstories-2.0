/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

import type translation from '../app/i18n/locales/en/translation.json'
import type footer from '../app/i18n/locales/en/footer.json'
import type main from '../app/i18n/locales/en/main.json'
import type navbar from '../app/i18n/locales/en/navbar.json'

interface I18nNamespaces {
  translation: typeof translation
  footer: typeof footer
  main: typeof main
  navbar: typeof navbar
}

declare module 'i18next' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface CustomTypeOptions {
    // returnNull: false
    // defaultNS: 'translation'
    resources: I18nNamespaces
  }
}
