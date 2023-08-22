'use client'

import { cva, cx } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import useStep from '@/src/lib/api/step/useStep'
import EmbedIconFactory from '@/src/components/Icons/EmbedIconFactory'
import BaseIcon from '@/src/components/Icons/BaseIcon'

type SidebarSlideProps = VariantProps<typeof slideStyle> & {
  stepId: string
  active?: boolean
  markerHover?: boolean
  position?: number
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
  position,
  variant,
}: SidebarSlideProps) {
  const { step } = useStep(stepId)

  return (
    <div className="flex items-center">
      <div
        className={cx(
          slideStyle({ variant }),
          active ? 'border-2 bg-active border-active-border' : 'bg-slate-100',
          markerHover ? 'border-2 border-red-600' : '',
        )}
      >
        {position != null && (
          <p className="absolute left-2 top-2">{position + 1}</p>
        )}

        {step?.content && step?.content.length > 0 && (
          <div className="flex w-full max-w-[145px] items-center justify-center -space-x-3 overflow-hidden p-4">
            {step.content
              .sort((a, b) => a.position - b.position)
              .slice(0, 3)
              .map(c => (
                <EmbedIconFactory key={c.id} type={c.type} />
              ))}
            {step.content.length > 3 && (
              <BaseIcon className="flex items-center justify-center bg-white text-sm">
                +{step.content.length - 3}
              </BaseIcon>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
