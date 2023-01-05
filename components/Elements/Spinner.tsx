import type { VariantProps } from 'class-variance-authority'
import { cva, cx } from 'class-variance-authority'

const spinner = cva('animate-spin', {
  variants: {
    variant: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      light: 'text-slate-300',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-16 w-16',
      xl: 'h-24 w-24',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type SpinnerProps = VariantProps<typeof spinner> & {
  className?: string
}

/**
 *
 * @param SpinnerProps size and variant of the spinner
 * @returns Animated spinner
 */
export function Spinner({ size, variant, className = '' }: SpinnerProps) {
  return (
    <>
      <svg
        className={cx(spinner({ size, variant }), className)}
        data-testid="loading"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill="currentColor"
        ></path>
      </svg>
      <span className="sr-only">Loading</span>
    </>
  )
}
