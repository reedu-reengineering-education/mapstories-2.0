/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

import type translation from '../src/app/i18n/locales/en/translation.json'
import type footer from '../src/app/i18n/locales/en/footer.json'
import type main from '../src/app/i18n/locales/en/main.json'
import type navbar from '../src/app/i18n/locales/en/navbar.json'
import type editModal from '../src/app/i18n/locales/en/editModal.json'
import type studio from '../src/app/i18n/locales/en/studio.json'

interface I18nNamespaces {
  translation: typeof translation
  footer: typeof footer
  main: typeof main
  navbar: typeof navbar
  editModal: typeof editModal
  studio: typeof studio
}

declare module 'i18next' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface CustomTypeOptions {
    // returnNull: false
    // defaultNS: 'translation'
    resources: I18nNamespaces
  }
}
