import Image, { ImageProps } from 'next/image'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cx } from 'class-variance-authority'

type AvatarProps = AvatarPrimitive.AvatarProps

export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cx(
        'flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full bg-slate-100',
        className,
      )}
      {...props}
    />
  )
}

Avatar.Image = function AvatarImage({
  src,
  className,
  alt,
  width = 32,
  height = 32,
  ...props
}: ImageProps) {
  if (!src) {
    return <Avatar.Fallback />
  }

  return (
    <Image
      alt={alt}
      className={cx('object-cover', className)}
      height={height}
      src={src}
      width={width}
      {...props}
    />
  )
}

Avatar.Fallback = function AvatarFallback({
  className,
  children,
  ...props
}: AvatarPrimitive.AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cx('', className)}
      delayMs={0}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
}
