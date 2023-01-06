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
            'my-0 mb-2 block h-9 w-[350px] rounded-md border border-slate-300 py-2 px-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1',
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

      // <>
      //   <input
      //     {...registration}
      //     // id="email"
      //     className="border-darkblue text-darkblue focus:border-normalblue peer ml-6 h-10 w-full w-11/12 border-b border-dotted font-bold placeholder-transparent focus:outline-none"
      //     defaultValue={defaultValue}
      //     onChange={onChange}
      //     placeholder=" "
      //     type={type}
      //     value={value}
      //   />
      //   <label
      //     className="text-gray peer-placeholder-shown:text-gray peer-focus:text-normalblue pointer-events-none absolute left-0 -top-3.5 flex text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm"
      //     htmlFor={label}
      //   >
      //     <div className="absolute h-full">
      //       <Icon className="relative top-1/4" height="50%" />
      //     </div>
      //     <span className="pl-6">{label}</span>
      //   </label>
      //   {error?.message && (
      //     <small className="text-red pl-6">{error.message}</small>
      //   )}
      // </>
    )
  },
)
