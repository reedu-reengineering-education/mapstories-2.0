'use client'

import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

type TooltipProps = {
  children: React.ReactNode
  content: string
  // open?: boolean
  // defaultOpen?: boolean
  // onOpenChange?: () => any
}

export function Tooltip({
  children,
  content,
  // open,
  // defaultOpen,
  // onOpenChange,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root
      // defaultOpen={defaultOpen}
      // onOpenChange={onOpenChange}
      // open={open}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          className="TooltipContent content-center"
          side="top"
          {...props}
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
