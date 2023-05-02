import { cx } from 'class-variance-authority'
import { Spinner } from './Spinner'

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
  if (src) {
    return (
      <div className="relative ">
        <img
          className={cx(
            'max-h-[20rem] object-scale-down',
            size == 'xs' ? 'h-10 w-10' : '',
          )}
          // className="max-h-[20rem] object-scale-down"
          src={src}
        ></img>
        {/* <Image
          alt={alt ? alt : src}
          className="max-w-[100%]"
          layout="fill"
          src={src}
          // width={1000}
          // objectFit="contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw,  33vw"
        /> */}
      </div>
    )
  }
  return <Spinner></Spinner>
}
