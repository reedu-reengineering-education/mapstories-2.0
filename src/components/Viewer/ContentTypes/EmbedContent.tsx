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
    cookieKey: `${content.type}Consent`,
  })

  if (!content.content) {return null}

  return (
    <div className="relative flex max-h-[24rem] w-full justify-center overflow-y-hidden overflow-x-hidden">
      {!isAllowed && (
        <>
        
           {/* <Embed
            media={urlToMedia(content.content)}
            options={content.options as object}
          /> */}

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
