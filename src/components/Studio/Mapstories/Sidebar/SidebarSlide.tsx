import { cva, cx } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

type SidebarSlideProps = VariantProps<typeof slideStyle> & {
  active?: boolean
  markerHover?: boolean
  children: React.ReactElement
}

const slideStyle = cva(
  'flex aspect-video w-full items-center justify-center rounded-lg',
  {
    variants: {
      variant: {
        title: 'bg-slate-300',
        normal: '',
      },
    },
    defaultVariants: {
      variant: 'normal',
    },
  },
)

export default function SidebarSlide({
  children,
  active,
  markerHover,
  variant,
}: SidebarSlideProps) {
  return (
    <div
      className={cx(
        slideStyle({ variant }),
        active ? 'border-2 bg-active' : 'bg-slate-100',
        markerHover ? 'border-2 border-red-600' : '',
      )}
    >
      {children}
    </div>
  )
}
