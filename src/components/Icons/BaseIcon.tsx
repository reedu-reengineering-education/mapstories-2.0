import { cx } from 'class-variance-authority'
import { HTMLAttributes } from 'react'

interface BaseIconProps extends HTMLAttributes<HTMLDivElement> {}

export default function BaseIcon(props: BaseIconProps) {
  return (
    <div
      {...props}
      className={cx(
        'flex aspect-square h-10 items-center justify-center rounded-full border-2 border-white p-2',
        props.className,
      )}
    />
  )
}
