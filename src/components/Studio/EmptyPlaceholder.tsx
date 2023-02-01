import * as React from 'react'

import { cx } from 'class-variance-authority'

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cx(
        'animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center',
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}

interface EmptyPlaceholderIconProps
  extends Partial<React.SVGProps<SVGSVGElement>> {
  icon: (_props: React.ComponentProps<'svg'>) => JSX.Element
}

EmptyPlaceholder.Icon = function EmptyPlaceHolderIcon({
  icon,
  className,
  ...props
}: EmptyPlaceholderIconProps) {
  const Icon = icon

  if (!Icon) {
    return null
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
      <Icon className={cx('h-10 w-10', className)} {...props} />
    </div>
  )
}

interface EmptyPlacholderTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: EmptyPlacholderTitleProps) {
  return (
    <h2 className={cx('mt-6 text-xl font-semibold', className)} {...props} />
  )
}

interface EmptyPlacholderDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlacholderDescriptionProps) {
  return (
    <p
      className={cx(
        'mt-3 mb-8 text-center text-sm font-normal leading-6 text-slate-700',
        className,
      )}
      {...props}
    />
  )
}
