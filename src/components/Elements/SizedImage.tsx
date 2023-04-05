import Image from 'next/image'

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
    case 'xs':
      width = 50
      height = 50
      break
    default:
      width = 100
      height = 100
  }
  return <Image alt={alt ? alt : src} height={height} src={src} width={width} />
}
