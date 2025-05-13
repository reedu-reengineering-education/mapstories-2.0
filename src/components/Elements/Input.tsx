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
    {
      type = 'text',
      label,
      className,
      registration,
      errors,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="grid gap-1">
        {label && (
          <label
            className={cx(
              'block text-sm font-medium',
              disabled ? 'text-gray-400' : 'text-gray-700',
            )}
            htmlFor={label}
          >
            {label}
          </label>
        )}
        <input
          className={cx(
            'my-0 mb-2 block h-9 w-full rounded-md border px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1',
            disabled
              ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 placeholder-gray-400 focus:ring-0'
              : 'border-slate-300 hover:border-slate-400 focus:border-neutral-300',
            className,
          )}
          disabled={disabled}
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
