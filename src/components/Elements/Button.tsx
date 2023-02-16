import * as React from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cva, cx } from 'class-variance-authority'

import { Spinner } from '@/src/components/Elements/Spinner'

const buttonStyle = cva(
  'flex items-center rounded-md font-medium focus:outline-none border disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      variant: {
        primary: 'border-transparent text-white bg-black hover:bg-hover justify-center focus:ring-2 focus:ring-black focus:ring-offset-2',
        inverse: 'border-zinc-300 text-black bg-white hover:bg-hover justify-center focus:ring-2 focus:ring-black focus:ring-offset-2',
        danger: 'border-transparent text-white bg-red-500 hover:bg-red-400 justify-center focus:ring-2 focus:ring-black focus:ring-offset-2',
        noStyle: 'border-0 justify-left'
      },
      size: {
        sm: 'py-1 px-3 text-sm',
        md: 'py-2 px-4 text-md',
        lg: 'py-3 px-5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type IconProps =
  | { startIcon: React.ReactElement; endIcon?: never }
  | { endIcon: React.ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined }

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyle> &
  IconProps & {
    isLoading?: boolean
  }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      className = '',
      variant,
      size,
      isLoading = false,
      startIcon,
      endIcon,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cx(buttonStyle({ variant, size }), className)}
        ref={ref}
        type={type}
        {...props}
      >
        {isLoading && (
          <Spinner
            className="text-current"
            size="sm"
            variant={variant === 'primary' ? 'inverse' : 'primary'}
          />
        )}
        {!isLoading && startIcon}
        <span className="mx-2">{props.children}</span> {!isLoading && endIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'
