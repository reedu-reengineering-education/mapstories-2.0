import { TagIcon } from '@heroicons/react/24/outline'
import { cva } from 'class-variance-authority'

const badgeVariant = cva(
  'w-fit rounded-full px-2 py-1 text-xs flex gap-1 bg-green-200 text-green-900',
)

export type TagBadgeProps = React.ComponentPropsWithoutRef<'div'> & {
  tagName: string | undefined
}

export function TagBadge({ children, ...props }: TagBadgeProps) {
  return (
    <div className={badgeVariant()}>
      <TagIcon className="w-4" />
      <span>{props.tagName}</span>
    </div>
  )
}
