import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

const title = cva('', {
  variants: {
    variant: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      inverse: 'text-white',
    },
    size: {
      sm: 'md:text-md text-sm font-semibold',
      md: 'md:text-3xl text-xl',
      lg: 'md:text-5xl text-3xl',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

type TitleProps = VariantProps<typeof title> & {
  children: React.ReactElement | string
}

export default function Title({ variant, size, children }: TitleProps) {
  return <span className={title({ variant, size })}>{children}</span>
}
