'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cx } from 'class-variance-authority'

type DropdownMenuProps = DropdownMenuPrimitive.DropdownMenuProps

export function DropdownMenu({ ...props }: DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root {...props} />
}

DropdownMenu.Trigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuPrimitive.DropdownMenuTriggerProps
>(function DropdownMenuTrigger({ ...props }, ref) {
  return <DropdownMenuPrimitive.Trigger {...props} ref={ref} />
})

DropdownMenu.Portal = DropdownMenuPrimitive.Portal

DropdownMenu.Content = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.MenuContentProps
>(function DropdownMenuContent({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Content
      align="end"
      className={cx(
        'animate-in slide-in-from-top-1 overflow-hidden rounded-md border border-slate-50 bg-white shadow-md md:w-32',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

DropdownMenu.Item = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuItemProps
>(function DropdownMenuItem({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Item
      className={cx(
        'flex cursor-default select-none items-center py-2 px-3 text-sm text-slate-600 outline-none focus:bg-slate-50 focus:text-black',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

DropdownMenu.Separator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuSeparatorProps
>(function DropdownMenuItem({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cx('h-px bg-slate-200', className)}
      ref={ref}
      {...props}
    />
  )
})
