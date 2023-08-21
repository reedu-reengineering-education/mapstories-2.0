'use client'

import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

type TooltipProps = {
  children: React.ReactNode
  content: string
  maxwidth?: string
  delayDuration?: TooltipPrimitive.TooltipProviderProps['delayDuration']
  side?: TooltipPrimitive.TooltipContentProps['side']
}

export function Tooltip({
  children,
  content,
  maxwidth,
  delayDuration = 300,
  side = 'top',
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          className="TooltipContent content-center break-words"
          side={side}
          style={{ maxWidth: maxwidth ?? '', zIndex: 99999 }}
        >
          {content}
          <TooltipPrimitive.Arrow
            className="TooltipArrow"
            height={5}
            width={11}
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
