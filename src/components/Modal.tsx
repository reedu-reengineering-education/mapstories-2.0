'use client'

import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cx } from 'class-variance-authority'
import React, { Fragment } from 'react'

interface Props {
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (_open: boolean) => void
  title: React.ReactElement | String
  description?: React.ReactElement | String
  children?: React.ReactElement | React.ReactElement[]
  setDisabled?: React.Dispatch<React.SetStateAction<boolean>>
  onClose?: () => void
}

export function Modal({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  setDisabled,
  onClose,
}: Props) {
  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      {trigger ? (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      ) : null}
      <DialogPrimitive.Portal>
        <Transition.Root
          className="absolute left-0 top-0 flex h-full w-full items-center justify-center"
          show={open ?? false}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogPrimitive.Overlay
              className="fixed inset-0 z-[100] bg-black/50"
              forceMount
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPrimitive.Content
              className={cx(
                'fixed z-[100] overflow-hidden',
                'w-[200vw] rounded-lg md:w-full md:max-w-[48rem]',
                'bg-white',
                'grid gap-1',
              )}
              forceMount
              onPointerDownOutside={e => e.preventDefault()}
            >
              <div className="p-6">
                <DialogPrimitive.Title className="text-lg font-medium">
                  {title}
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="text-sm text-gray-600">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>

              <div>{children}</div>

              <DialogPrimitive.Close
                className={cx(
                  'absolute right-3.5 top-3.5 inline-flex items-center justify-center rounded-full p-1',
                )}
                onClick={onClose ? onClose : undefined}
              >
                <XMarkIcon className="w-5" />
              </DialogPrimitive.Close>
            </DialogPrimitive.Content>
          </Transition.Child>
        </Transition.Root>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {}

Modal.Content = function ModalContent({
  className,
  ...props
}: ModalContentProps) {
  return <div className={cx('px-6 pb-4', className)} {...props} />
}

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  close?: React.ReactElement
}

Modal.Footer = function ModalFooter({
  className,
  close,
  ...props
}: ModalFooterProps) {
  return (
    <div className={cx('border-t bg-slate-50 px-6 py-4', className)} {...props}>
      {close && <DialogPrimitive.Close asChild>{close}</DialogPrimitive.Close>}
      {props.children}
    </div>
  )
}
