import { cx } from 'class-variance-authority'

type SidebarSlideProps = {
  active?: boolean
  markerHover?: boolean
  children: React.ReactElement
}

export default function SidebarSlide({
  children,
  active,
  markerHover,
}: SidebarSlideProps) {
  return (
    <div
      className={cx(
        'flex aspect-video w-full items-center justify-center rounded-lg',
        active ? 'border-2 bg-active' : 'bg-slate-100',
        markerHover ? 'border-2 border-red-600' : '',
      )}
    >
      {children}
    </div>
  )
}
