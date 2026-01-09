import * as SwitchPrimitive from '@radix-ui/react-switch'
import { forwardRef, useState } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

const switchThumbStyle = cva(
  `
  pointer-events-none inline-block h-5 w-5
  transform rounded-full shadow-lg
  transition-transform transition-colors
  `,
  {
    variants: {
      checked: {
        true: 'translate-x-5 bg-white',
        false: 'translate-x-0 bg-white',
      },
    },
  },
)

const switchThumbInnerStyle = cva(
  'h-3 w-3 rounded-full bg-white transition-opacity',
  {
    variants: {
      checked: {
        false: 'opacity-100',
        true: 'opacity-0',
      },
    },
  },
)

const switchBorderStyle = cva(
  `
  relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
  rounded-full transition-colors
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-green-500 focus-visible:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
  `,
  {
    variants: {
      checked: {
        true: 'bg-green-500',
        false: 'bg-gray-300',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
)



type SwitchProps = SwitchPrimitive.SwitchProps &
  VariantProps<typeof switchBorderStyle>

export default forwardRef<
  HTMLButtonElement,
  SwitchPrimitive.SwitchProps
>(({ defaultChecked = false, onCheckedChange, ...props }, ref) => {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <SwitchPrimitive.Root
      checked={checked}
      className={switchBorderStyle({ checked })}
      onCheckedChange={val => {
        setChecked(val)
        onCheckedChange?.(val)
      }}
      ref={ref}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={`${switchThumbStyle({ checked })} }`}
      />
    </SwitchPrimitive.Root>
  )
})
