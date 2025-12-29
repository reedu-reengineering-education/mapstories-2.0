'use client'

import * as React from 'react'
import { SlideContent } from '@prisma/client'
import { Embed } from '../../embeds/Embed'
import { urlToMedia } from '@/src/helper/urlToMedia'
import { useCookieConsent } from '@/src/lib/api/cookieConsent/useCookieConsent'
import { ConsentOverlay } from './ConsentOverlay' 

interface Props {
  content: SlideContent
}

export function EmbedContent({ content }: Props) {
  const {
    isAllowed,
    rememberDecision,
    setRememberDecision,
    allow,
  } = useCookieConsent({
    service: `${content.type}Consent`,
  })

  if (!content.content) {return null}

  return (
    <div className="relative flex max-h-[24rem] w-full p-2 justify-center ">
      {!isAllowed && (
        <>
          <ConsentOverlay
            embed={content}
            onConfirm={allow}
            onRememberChange={setRememberDecision}
            rememberDecision={rememberDecision}
          />
        </>
      )}

      {isAllowed && (
        <Embed
          media={urlToMedia(content.content)}
          options={content.options as object}
        />
      )}
    </div>
  )
}
