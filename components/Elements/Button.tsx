import * as React from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cva, cx } from 'class-variance-authority'

import { Spinner } from '@/components/Elements/Spinner'

const buttonStyle = cva(
  'flex items-center justify-center rounded-full border-2 font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      variant: {
        primary:
          'border-primary text-primary hover:bg-primary hover:text-white',
        inverse: 'text-white hover:bg-white hover:text-secondary border-white',
        danger: 'bg-red-600 text-white hover:bg-red-50:text-red-600',
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
        {isLoading && <Spinner className="text-current" size="sm" />}
        {!isLoading && startIcon}
        <span className="mx-2">{props.children}</span> {!isLoading && endIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'
