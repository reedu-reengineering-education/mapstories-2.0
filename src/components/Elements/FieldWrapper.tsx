import clsx from 'clsx'
import * as React from 'react'
import { Spinner } from './Spinner'

type FieldWrapperProps = {
  label?: string
  className?: string
  children: React.ReactNode
  loading?: boolean
}

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  'className' | 'children'
>

export function FieldWrapper(props: FieldWrapperProps) {
  const { label, className, children, loading } = props
  return (
    <div className={clsx('mb-4 mt-2 flex-1', className)}>
      <div className="flex items-center">
        <label className="ml-2 block text-sm font-semibold">{label}</label>
        {loading && <Spinner className="h-4" />}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  )
}
