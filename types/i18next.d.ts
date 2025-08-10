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
import type embeds from '../src/app/i18n/locales/en/embeds.json'
import type studio from '../src/app/i18n/locales/en/studio.json'
import type settingsModal from '../src/app/i18n/locales/en/settingsModal.json'
import type mapstorySidebar from '../src/app/i18n/locales/en/mapstorySidebar.json'
import type mapstoryCard from '../src/app/i18n/locales/en/mapstoryCard.json'
import type settings from '../src/app/i18n/locales/en/settings.json'
import type userSettingsForm from '../src/app/i18n/locales/en/userSettingsForm.json'
import type editMapstory from '../src/app/i18n/locales/en/editMapstory.json'
import type login from '../src/app/i18n/locales/en/login.json'
import type dashboardLayout from '../src/app/i18n/locales/en/dashboardLayout.json'
import type viewer from '../src/app/i18n/locales/en/viewer.json'
import type step from '../src/app/i18n/locales/en/step.json'
import type gallery from '../src/app/i18n/locales/en/gallery.json'
import type timeline from '../src/app/i18n/locales/en/timeline.json'
import type changeEmail from '../src/app/i18n/locales/en/changeEmail.json'
import type supportTab from '../src/app/i18/locales/de/supportTab.json'
import type offerTab from '../src/app/i18/locales/de/offerTab.json'
import type mapstoriesTab from '../src/app/i18/locales/de/mapstoriesTab.json'
import type faq from '../src/app/i18n/locales/en/faq.json'
import type about from '../src/app/i18n/locales/en/about.json'

interface I18nNamespaces {
  translation: typeof translation
  footer: typeof footer
  main: typeof main
  navbar: typeof navbar
  editModal: typeof editModal
  embeds: typeof embeds
  settingsModal: typeof settingsModal
  studio: typeof studio
  mapstorySidebar: typeof mapstorySidebar
  mapstoryCard: typeof mapstoryCard
  settings: typeof settings
  userSettingsForm: typeof userSettingsForm
  editMapstory: typeof editMapstory
  login: typeof login
  dashboardLayout: typeof dashboardLayout
  viewer: typeof viewer
  step: typeof step
  gallery: typeof gallery
  timeline: typeof timeline
  changeEmail: typeof changeEmail
  supportTab: typeof supportTab
  offerTab: typeof offerTab
  faq: typeof faq
  mapstoriesTab: typeof mapstoriesTab
  faq: typeof faq
  about: typeof about
  manualsTab: typeof manualsTab
}

declare module 'i18next' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface CustomTypeOptions {
    // returnNull: false
    // defaultNS: 'translation'
    resources: I18nNamespaces
  }
}
