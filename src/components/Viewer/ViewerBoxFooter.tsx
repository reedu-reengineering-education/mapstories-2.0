import { cx } from 'class-variance-authority'

type Props = {
  children: React.ReactNode
  className?: string
}

// Footer bar that sits flush at the bottom of the viewer content box.
export function ViewerBoxFooter({ children, className }: Props) {
  return (
    <div
      className={cx(
        'flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
