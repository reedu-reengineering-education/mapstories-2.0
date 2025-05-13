'use client'

import { cx } from 'class-variance-authority'
import * as React from 'react'
import hotToast, { Toaster as HotToaster } from 'react-hot-toast'

export const Toaster = HotToaster

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean
}

export function Toast({ visible, className, ...props }: ToastProps) {
  return (
    <div
      className={cx(
        'mb-2 flex min-h-16 w-[350px] flex-col items-start gap-1 rounded-md px-6 py-4 shadow-lg',
        visible ? 'animate-in slide-in-from-bottom-5' : '',
        className,
      )}
      {...props}
    />
  )
}

interface ToastTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

Toast.Title = function ToastTitle({ className, ...props }: ToastTitleProps) {
  return <span className={cx('text-sm font-medium', className)} {...props} />
}

interface ToastDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

Toast.Description = function ToastDescription({
  className,
  ...props
}: ToastDescriptionProps) {
  return <span className={cx('text-sm opacity-80', className)} {...props} />
}

interface ToastOpts {
  title?: string
  message: string
  type?: 'success' | 'error' | 'default'
  duration?: number
}

export function toast(opts: ToastOpts) {
  const { title, message, type = 'default', duration = 3000 } = opts

  return hotToast.custom(
    ({ visible }) => (
      <Toast
        className={cx(
          'px-8',
          type === 'error'
            ? 'bg-red-600 text-white'
            : type === 'success'
              ? 'bg-black text-white'
              : '',
        )}
        visible={visible}
      >
        <Toast.Title>{title}</Toast.Title>
        {message && <Toast.Description>{message}</Toast.Description>}
      </Toast>
    ),
    { duration },
  )
}
