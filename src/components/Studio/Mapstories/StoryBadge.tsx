import { CalendarDaysIcon, MapIcon } from '@heroicons/react/24/outline'
import { StoryMode } from '@prisma/client'
import { cva, VariantProps } from 'class-variance-authority'

const badgeVariant = cva('w-fit rounded-full px-2 py-1 text-xs flex gap-1', {
  variants: {
    mode: {
      [StoryMode.NORMAL]: 'bg-blue-200 text-blue-900',
      [StoryMode.TIMELINE]: 'bg-teal-200 text-teal-900',
    },
  },
})

export type BadgeVariantProps = VariantProps<typeof badgeVariant>

export function StoryBadge({ mode }: BadgeVariantProps) {
  return (
    <div className={badgeVariant({ mode })}>
      {mode === StoryMode.NORMAL ? (
        <MapIcon className="w-4" />
      ) : (
        <CalendarDaysIcon className="w-4" />
      )}
      {mode === StoryMode.NORMAL ? 'Normal' : 'Timeline'}
    </div>
  )
}
