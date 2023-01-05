import * as React from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

const spacer = cva('', {
  variants: {
    size: {
      sm: 'my-4',
      md: 'my-8',
      lg: 'my-16',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type SpacerProps = VariantProps<typeof spacer>

/**
 *
 * @param SpacerProps size of the spacer
 * @returns A spacer to create some space 🧑‍🚀
 */
export function Spacer({ size }: SpacerProps) {
  return <div className={spacer({ size })}></div>
}
