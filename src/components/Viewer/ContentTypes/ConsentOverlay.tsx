'use client'

import * as React from 'react'
import EmbedIconFactory from '../../Icons/EmbedIconFactory'
import { getMediaPrivacyInfo } from '@/src/helper/embedPrivacy'
import { Button } from '../../Elements/Button'
import Switch from '../../Elements/Switch'

interface ConsentOverlayProps {
  description?: string
  rememberDecision: boolean
  onRememberChange: (value: boolean) => void
  onConfirm: () => void
  confirmLabel?: string
  embed: any
}

export function ConsentOverlay({
  description,
  onRememberChange,
  onConfirm,
  embed,
}: ConsentOverlayProps) {
  const policyUrl = getMediaPrivacyInfo(embed.type)?.privacyPolicyUrl
  const defaultDescription =
    'By confirming below, you agree to load content from the following service:'

  return (
    <div className="inset-0 z-10 flex items-center justify-center">
      {/* 🔥 BACKDROP */}
      <div className="absolute p-5 inset-0 bg-black/50 backdrop-blur-md" />

      {/* 🧊 FOREGROUND CARD */}
      <div
        className="
          relative z-10
          w-full max-w-md
          rounded-[10px]
          border-[3px] border-[#38383a]
          bg-white/90
          shadow-[4px_4px_0px_#38383a]
          p-6
          flex flex-col gap-4
        "
      >
        <p className="text-center text-gray-900 text-base font-medium">
          {description || defaultDescription}
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
              Privacy Policy
            </a>
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-gray-700">Nur einmalig</span>
          <Switch
            defaultChecked={false}
            onCheckedChange={onRememberChange}
          />
          <span className="text-sm text-gray-700">
            Entscheidung merken
          </span>
        </div>

        <Button onClick={onConfirm} variant="primary">
          Inhalt laden
        </Button>
      </div>
    </div>
  )
}
