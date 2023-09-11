import { cx } from 'class-variance-authority'
import React from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import 'reactjs-popup/dist/index.css'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  registration?: Partial<UseFormRegisterReturn>
  errors?: FieldError
  valid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { type = 'text', label, className, registration, errors, valid, ...props },
    ref,
  ) => {
    return (
      <div className="grid gap-1">
        <label className="sr-only" htmlFor={label}>
          {label}
        </label>
        <input
          className={cx(
            'my-0 mb-2 block h-9 w-full rounded-md border   px-3 py-2 text-sm placeholder:text-slate-400  focus:outline-none focus:ring-2  focus:ring-offset-1',
            className,
            valid
              ? 'border-slate-300 hover:border-slate-400 focus:border-neutral-300 focus:ring-neutral-800'
              : 'border-rose-600 hover:border-rose-400 focus:border-rose-300 focus:ring-rose-600',
          )}
          ref={ref}
          size={props.size ?? 32}
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

interface InputLabelProps extends React.HTMLAttributes<HTMLLabelElement> {}

export function InputLabel({ className, ...props }: InputLabelProps) {
  return (
    <label
      className={cx('mb-2 block text-sm font-medium text-gray-700', className)}
      {...props}
    />
  )
}
