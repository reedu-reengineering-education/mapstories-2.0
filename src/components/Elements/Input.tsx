import { cx } from 'class-variance-authority'
import React from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  registration?: Partial<UseFormRegisterReturn>
  errors?: FieldError
}

export const Input = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { type = 'text', label, className, registration, errors, ...props },
    ref,
  ) => {
    return (
      <div className="grid gap-1">
        <label className="sr-only" htmlFor={label}>
          {label}
        </label>
        <input
          className={cx(
            'my-0 mb-2 block h-9 w-full rounded-md border border-slate-300 py-2 px-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1',
            className,
          )}
          ref={ref}
          size={32}
          type={type}
          {...registration}
          {...props}
        />
        {errors?.message && (
          <p className="px-1 text-xs text-red-600">{errors.message}</p>
        )}
      </div>
    )
  },
)

interface InputLabelProps extends React.HTMLAttributes<HTMLLabelElement> { }

export function InputLabel({ className, ...props }: InputLabelProps) {
  return (
    <label
      className={cx('mb-2 block text-sm font-medium text-gray-700', className)}
      {...props}
    />
  )
}
