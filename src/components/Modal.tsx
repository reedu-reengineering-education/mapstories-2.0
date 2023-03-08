'use client'

import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cx } from 'class-variance-authority'
import React, { Fragment, useState } from 'react'

interface Props {
  trigger: React.ReactElement
  title: React.ReactElement | String
  description?: React.ReactElement | String
  children?: React.ReactElement | React.ReactElement[]
  setDisabled?: React.Dispatch<React.SetStateAction<boolean>>
}

export function Modal({
  trigger,
  title,
  description,
  children,
  setDisabled,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DialogPrimitive.Root
      onOpenChange={e => {
        setIsOpen(e)
        setDisabled ? setDisabled(e) : null
      }}
      open={isOpen}
    >
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal forceMount>
        <Transition.Root
          className="absolute top-0 left-0 flex h-full w-full items-center justify-center"
          show={isOpen}
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
              className="fixed inset-0 z-20 bg-black/50"
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
                'fixed z-50 overflow-hidden',
                'w-[95vw] max-w-md rounded-lg md:w-full',
                'bg-white',
                'grid gap-1',
              )}
              forceMount
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
                  'absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1',
                )}
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
  trigger?: React.ReactElement
}

Modal.Footer = function ModalFooter({
  className,
  trigger,
  ...props
}: ModalFooterProps) {
  return (
    <div className={cx('border-t bg-slate-50 px-6 py-4', className)} {...props}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}
    </div>
  )
}
