'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cx } from 'class-variance-authority'

type DropdownMenuProps = DropdownMenuPrimitive.DropdownMenuProps

// Non-modal by default: a modal Radix menu sets `pointer-events: none` on
// <body> while open. Dialog/Select ship a different copy of
// @radix-ui/react-dismissable-layer, so when both are involved (or the menu
// unmounts during a route change) each copy restores the other's "none" and
// the whole page stays unclickable.
export function DropdownMenu({ modal = false, ...props }: DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root modal={modal} {...props} />
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
  DropdownMenuPrimitive.DropdownMenuContentProps
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
        'flex cursor-default select-none items-center px-3 py-2 text-sm text-slate-600 outline-none focus:bg-hover focus:text-black',
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
