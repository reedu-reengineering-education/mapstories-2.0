'use client'

import { CheckIcon } from '@heroicons/react/24/solid'
import { cx } from 'class-variance-authority'
import { BFDW_TOPICS } from '@/src/lib/bfdwTopics'

type Props = {
  value?: string | null
  onChange: (topic: string | null) => void
  noneLabel: string
}

// Topic area ("Themenbereich") selection for stories. Each option shows
// the color the story will get in the gallery.
export function BfdwTopicPicker({ value, onChange, noneLabel }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
      {BFDW_TOPICS.map(topic => {
        const selected = value === topic.key
        return (
          <button
            aria-checked={selected}
            className={cx(
              'flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-white transition-all',
              selected
                ? 'ring-2 ring-offset-2'
                : 'opacity-60 hover:opacity-100',
            )}
            key={topic.key}
            onClick={() => onChange(selected ? null : topic.key)}
            role="radio"
            style={{
              backgroundColor: topic.color,
              // ring color follows the topic color
              ['--tw-ring-color' as any]: topic.color,
            }}
            type="button"
          >
            <span className="flex-1">{topic.label}</span>
            {selected && <CheckIcon className="h-4 w-4 shrink-0" />}
          </button>
        )
      })}
      <button
        aria-checked={!value}
        className={cx(
          'rounded-md border-2 border-dashed px-3 py-2 text-left text-sm text-slate-600 transition-all sm:col-span-2',
          !value ? 'border-slate-500' : 'border-slate-200 hover:border-slate-400',
        )}
        onClick={() => onChange(null)}
        role="radio"
        type="button"
      >
        {noneLabel}
      </button>
    </div>
  )
}
