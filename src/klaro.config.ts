import type { KlaroConfig } from 'klaro'

export const klaroConfig: KlaroConfig = {
  storageMethod: 'cookie',
  storageName: 'klaro',
  privacyPolicy: '/privacy',
  mustConsent: true,
  acceptAll: true,
  hideDeclineAll: false,

  translations: {
    de: {
      analytics: {
        title: 'Statistik (Umami)',
        description:
          'Wir verwenden Umami, um anonymisierte Statistiken zur Nutzung unserer Website zu erfassen.',
      },
    },
  },

 services: [
  // Technisch notwendig
  {
    name: 'mapbox',
    title: 'Kartenfunktion (Mapbox)',
    purposes: ['functional'],
    required: true,
    description:
      'Mapbox wird benötigt, um interaktive Karten darzustellen. Dabei werden technisch notwendige Daten wie Ihre IP-Adresse an Mapbox übertragen. Ohne diesen Dienst ist die Kernfunktion der Website nicht nutzbar.',
  },
  {
    name: 'boundstore',
    title: 'Anwendungsstatus (BoundStore)',
    purposes: ['functional'],
    required: true,
    description:
      'Der BoundStore speichert den internen Zustand der Anwendung, z. B. ausgewählte Inhalte oder Einstellungen. Er ist technisch erforderlich und dient nicht der Analyse oder dem Tracking von Nutzerverhalten.',
  },
    {
    name: 'i18next',
    title: 'Spracheinstellungen (i18next)',
    purposes: ['functional'],
    required: true,
    description:
      'i18next speichert die von Ihnen gewählte Sprache, um die Website in Ihrer bevorzugten Sprache anzuzeigen. Diese Speicherung ist technisch notwendig und erfolgt ohne Tracking oder Weitergabe an Dritte.',
  },

  // Einwilligungspflichtig
  {
    name: 'umami',
    title: 'Statistik (Umami)',
    purposes: ['analytics'],
    required: false,
    description:
      'Umami wird verwendet, um anonymisierte Statistiken über die Nutzung der Website zu erstellen. Die Erhebung erfolgt ausschließlich nach Ihrer Einwilligung.',
  },
],

}
