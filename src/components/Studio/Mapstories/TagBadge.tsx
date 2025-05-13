import { TagIcon, TrashIcon } from '@heroicons/react/24/outline'
import { cva } from 'class-variance-authority'
import { useState } from 'react'

const badgeVariant = cva(
  'w-fit rounded-full px-2 py-1 text-xs flex gap-1 bg-green-200 text-green-900 relative',
)

export type TagBadgeProps = React.ComponentPropsWithoutRef<'div'> & {
  tagName: string
  onRemove: (tagName: string) => void
}

export function TagBadge({ tagName, onRemove }: TagBadgeProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={badgeVariant()}
      onMouseEnter={e => setHovered(true)}
      onMouseLeave={e => setHovered(false)}
    >
      {hovered && (
        <div className="absolute bottom-[2px] right-2 cursor-pointer rounded bg-white">
          <TrashIcon
            className="w-5 text-red-500"
            onClick={() => {
              onRemove(tagName)
            }}
          />
        </div>
      )}
      <TagIcon className="w-4" />
      <span>{tagName}</span>
    </div>
  )
}
