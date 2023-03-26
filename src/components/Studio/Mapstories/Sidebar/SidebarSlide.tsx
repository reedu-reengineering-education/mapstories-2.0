'use client'

import { cva, cx } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import useStep from '@/src/lib/api/step/useStep'
import EmbedIconFactory from '@/src/components/Icons/EmbedIconFactory'

type SidebarSlideProps = VariantProps<typeof slideStyle> & {
  stepId: string
  active?: boolean
  markerHover?: boolean
}

const slideStyle = cva(
  'flex aspect-video w-full items-end justify-center rounded-lg',
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
  stepId,
  active,
  markerHover,
  variant,
}: SidebarSlideProps) {
  const { step } = useStep(stepId)

  return (
    <div
      className={cx(
        slideStyle({ variant }),
        active ? 'border-2 bg-active' : 'bg-slate-100',
        markerHover ? 'border-2 border-red-600' : '',
      )}
    >
      {step?.content && step?.content.length > 0 && (
        <div className="flex w-full items-center justify-center -space-x-3 overflow-scroll p-4">
          {step.content.slice(0, 3).map(c => (
            <EmbedIconFactory key={c.id} type={c.type} />
          ))}
          {step.content.length > 3 && <EmbedIconFactory type={'MORE'} />}
        </div>
      )}
    </div>
  )
}
