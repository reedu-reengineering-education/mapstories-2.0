import { cx } from 'class-variance-authority'

type SidebarSlideProps = {
  active?: boolean
  children: React.ReactElement
}

export default function SidebarSlide({ children, active }: SidebarSlideProps) {
  return (
    <div
      className={cx(
        'flex aspect-video w-full items-center justify-center rounded-lg bg-slate-100',
        active ? 'border-2 border-slate-300' : '',
      )}
    >
      {children}
    </div>
  )
}
