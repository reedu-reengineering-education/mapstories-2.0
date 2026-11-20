'use client'

import * as React from 'react'
import clsx from 'clsx'

import { LanguageInfo } from '@/src/lib/languageFlags'

type Props = {
  languages: LanguageInfo[]
  value?: string
  onChange: (_code: string) => void
  placeholder?: string
  className?: string
}

// Native <select> on purpose: the Radix Select can't be scrolled inside our
// Radix Dialog (both ship their own react-remove-scroll, so the dialog's
// scroll lock swallows wheel events of the select's portal).
export const LanguageSelect = React.forwardRef<HTMLSelectElement, Props>(
  function LanguageSelect(
    { languages, value, onChange, placeholder, className },
    ref,
  ) {
    return (
      <select
        className={clsx(
          'h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
          className,
        )}
        onChange={e => onChange(e.target.value)}
        ref={ref}
        value={value ?? ''}
      >
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}
        {languages.map(l => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    )
  },
)
