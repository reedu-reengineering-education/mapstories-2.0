import { cx } from 'class-variance-authority'
import * as React from 'react'

interface StudioShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function StudioShell({
  children,
  className,
  ...props
}: StudioShellProps) {
  return (
    <div className={cx('grid items-start gap-8', className)} {...props}>
      {children}
    </div>
  )
}
