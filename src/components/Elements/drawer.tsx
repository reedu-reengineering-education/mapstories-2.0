'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cx } from 'class-variance-authority'

// Any other open Radix layer that legitimately locks the page.
const OTHER_MODAL_LAYER = [
  '[role="dialog"][data-state="open"]:not([data-vaul-drawer])',
  '[role="alertdialog"][data-state="open"]',
  '[role="menu"][data-state="open"]',
  '[role="listbox"][data-state="open"]',
].join(',')

// vaul (1.1.x) does not forward `modal={false}` to the underlying Radix
// Dialog, so the drawer is always a *modal* Radix layer that sets
// `body { pointer-events: none }`. vaul only undoes that once via
// requestAnimationFrame on mount/open; if Radix re-applies it later (e.g. on
// a remount during step navigation) the page stays unclickable. Keep the body
// clickable for as long as a non-modal drawer is open.
function useNonModalBodyPointerEvents(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled) {
      return
    }
    const body = document.body
    const release = () => {
      if (
        body.style.pointerEvents === 'none' &&
        !document.querySelector(OTHER_MODAL_LAYER)
      ) {
        body.style.pointerEvents = ''
      }
    }
    release()
    const observer = new MutationObserver(release)
    observer.observe(body, { attributes: true, attributeFilter: ['style'] })
    return () => observer.disconnect()
  }, [enabled])
}

function Drawer({
  modal = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  useNonModalBodyPointerEvents(!modal && props.open !== false)
  return <DrawerPrimitive.Root data-slot="drawer" modal={modal} {...props} />
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitive.Overlay
      className={cx('  bg-black/10 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50', className)}
      data-slot="drawer-overlay"
      ref={ref}
      {...props}
    />
  )
})
DrawerOverlay.displayName = 'DrawerOverlay'

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cx(
          'bg-background flex h-auto flex-col text-sm data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[90vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm group/drawer-content fixed z-50 outline-none focus:outline-none focus-visible:outline-none',
          className
        )}
        data-slot="drawer-content"
        {...props}
      >
        <div className="bg-muted h-1 w-[100px] rounded-full mx-auto hidden shrink-0 group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cx('gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left flex flex-col', className)}
      data-slot="drawer-header"
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cx('gap-2 p-4 mt-auto flex flex-col', className)}
      data-slot="drawer-footer"
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cx('text-foreground text-base font-medium', className)}
      data-slot="drawer-title"
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cx('text-muted-foreground text-sm', className)}
      data-slot="drawer-description"
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
