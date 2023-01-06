'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { cx } from 'class-variance-authority'
import { Bars3Icon, GlobeAltIcon, XMarkIcon } from '@heroicons/react/24/outline'

const routes = [
  {
    title: 'Studio',
    href: '/studio',
  },
  {
    title: 'Über Mapstories',
    href: '/about',
  },
  {
    title: 'Contact',
    href: '/contact',
    disabled: true,
  },
]

export function Navbar({ children }: { children?: React.ReactNode }) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  return (
    <>
      <div className="flex gap-6 md:gap-10">
        <Link className="hidden items-center space-x-2 md:flex" href="/">
          <GlobeAltIcon className="w-8" />
          <span className="hidden font-bold sm:inline-block">Mapstories</span>
        </Link>
        {routes?.length ? (
          <nav className="hidden gap-6 md:flex">
            {routes?.map((item, index) => (
              <Link
                className={cx(
                  'flex items-center text-lg font-semibold text-slate-600 sm:text-sm',
                  item.href.startsWith(`/${segment}`) ? 'text-slate-900' : '',
                  item.disabled ? 'cursor-not-allowed opacity-80' : '',
                )}
                href={item.disabled ? '#' : item.href}
                key={index}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}
        <button
          className="flex items-center space-x-2 md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <XMarkIcon className="w-5" />
          ) : (
            <Bars3Icon className="w-5" />
          )}
        </button>
        {showMobileMenu && <MobileNav>{children}</MobileNav>}
      </div>
      {children}
    </>
  )
}

function MobileNav({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className={cx(
        'animate-in slide-in-from-bottom-80 fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md md:hidden',
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-white p-4 shadow-md">
        <Link className="flex items-center space-x-2" href="/">
          <GlobeAltIcon className="w-8" />
          <span className="font-bold">Mapstories</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {routes.map((item, index) => (
            <Link
              className={cx(
                'flex w-full items-center rounded-md px-2 py-2 text-sm font-medium hover:underline',
                item.disabled ? 'cursor-not-allowed opacity-60' : '',
              )}
              href={item.disabled ? '#' : item.href}
              key={index}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
