'use client'

import * as React from 'react'
import EmbedIconFactory from '../../Icons/EmbedIconFactory'
import { getMediaPrivacyInfo } from '@/src/helper/embedPrivacy'
import { Button } from '../../Elements/Button'
import Switch from '../../Elements/Switch'
import { useBoundStore } from '@/src/lib/store/store'

interface ConsentOverlayProps {
  description?: string
  rememberDecision: boolean
  onRememberChange: (value: boolean) => void
  onConfirm: () => void
  confirmLabel?: string
  embed: any
}

export function ConsentOverlay({
  onRememberChange,
  onConfirm,
  embed,
}: ConsentOverlayProps) {
  const lng = useBoundStore(state => state.language) || 'de'
  const policyUrl = getMediaPrivacyInfo(embed.type)?.privacyPolicyUrl
  
  // Hardcodierte Texte um Re-render-Probleme durch useTranslation zu vermeiden
  const texts = {
      de:{
    disclaimer: 'Um diesen Inhalt anzuzeigen, müssen externe Inhalte geladen werden.',
    privacyPolicy: 'Datenschutzerklärung',
    once: 'Einmalig',
    rememberChoice: 'Auswahl merken',
    confirm: 'Inhalt laden',
      },
      en: {
        disclaimer: 'To view this content, external content must be loaded.',
        privacyPolicy: 'Privacy Policy',
        once: 'Once',
        rememberChoice: 'Remember choice',
        confirm: 'Load content',
      }
      ,
      es: {
        disclaimer: 'Para ver este contenido, se deben cargar contenidos externos.',
        privacyPolicy: 'Política de privacidad',
        once: 'Una vez',
        rememberChoice: 'Recordar elección',
        confirm: 'Cargar contenido',
      },
      fr: {
        disclaimer: 'Pour voir ce contenu, du contenu externe doit être chargé.',
        privacyPolicy: 'Politique de confidentialité',
        once: 'Une fois',
        rememberChoice: 'Se souvenir du choix',
        confirm: 'Charger le contenu',
      }

  }

  // Fallback auf Deutsch wenn Sprache nicht verfügbar
  const currentTexts = texts[lng as keyof typeof texts] || texts.de

  return (
    <div className="inset-0 z-10 flex items-center justify-center">
      <div className="absolute p-5 inset-0 bg-black/50 backdrop-blur-md" />
      <div
        className="
          relative z-10
           max-w-md
          rounded-md
          border-4 border-black
          bg-white/90
          shadow-md
          sm:p-2 md:p-6
          flex flex-col gap-4
        "
      >
        <p className="text-center text-gray-900 text-base font-medium">
          {currentTexts.disclaimer}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <EmbedIconFactory type={embed.type} />
          {embed.type}
        </div>

        <p className="text-center text-sm break-all">
          <a
            className="text-blue-600 underline"
            href={embed.content}
            rel="noopener noreferrer"
            target="_blank"
          >
            {embed.content}
          </a>
        </p>

        {policyUrl && (
          <p className="text-center text-sm">
            <a
              className="text-blue-600 underline"
              href={policyUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {currentTexts.privacyPolicy}
            </a>
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-gray-700">
            {currentTexts.once}
          </span>
          <Switch
            defaultChecked={false}
            onCheckedChange={onRememberChange}
          />
          <span className="text-sm text-gray-700">
            {currentTexts.rememberChoice}
          </span>
        </div>

        <Button className="w-1/2 self-center m-1" onClick={onConfirm} variant="primary">
          {currentTexts.confirm}
        </Button>
      </div>
    </div>
  )
}
