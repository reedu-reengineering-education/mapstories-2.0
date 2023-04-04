import { cva } from 'class-variance-authority'
import Image from 'next/image'

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

type ImageProps = {
  src: string
  size: string
  alt?: string
}

export default function SizedImage({ src, size, alt }: ImageProps) {
  let width, height
  switch (size) {
    case 's':
      width = 100
      height = 100
      break
    case 'm':
      width = 200
      height = 200
      break
    case 'l':
      width = 300
      height = 300
      break
  }
  return <Image alt={alt ? alt : src} height={height} src={src} width={width} />
}
