import * as SwitchPrimitive from '@radix-ui/react-switch'
import { forwardRef, useState } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

const switchThumbStyle = cva(
  'flex h-4 w-4 items-center justify-center rounded-full transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-slate-300',
      },
      checked: {
        true: 'translate-x-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
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

const switchBorderStyle = cva('w-10 p-1 rounded', {
  variants: {
    variant: {
      primary: 'bg-slate-50',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type SwitchProps = SwitchPrimitive.SwitchProps &
  VariantProps<typeof switchBorderStyle>

export default forwardRef<HTMLButtonElement, SwitchProps>(
  ({ variant, ...props }, ref) => {
    const [checked, setChecked] = useState(props.defaultChecked)

    return (
      <div className="flex items-center space-x-4">
        <SwitchPrimitive.Root
          className={switchBorderStyle({ variant })}
          ref={ref}
          {...props}
          onCheckedChange={val => {
            if (props.onCheckedChange) {
              props.onCheckedChange(val)
            }
            setChecked(val)
          }}
        >
          <SwitchPrimitive.Thumb asChild>
            <div className={switchThumbStyle({ variant, checked })}>
              <div className={switchThumbInnerStyle({ checked })} />
            </div>
          </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
      </div>
    )
  },
)
