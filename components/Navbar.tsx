'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { cx } from 'class-variance-authority'

interface MainNavProps {
  children?: React.ReactNode
}

const routes = [
  {
    title: 'Features',
    href: '/features',
    disabled: true,
  },
  {
    title: 'Pricing',
    href: '/pricing',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
  {
    title: 'Documentation',
    href: '/docs',
  },
  {
    title: 'Contact',
    href: '/contact',
    disabled: true,
  },
]

export function Navbar({ children }: MainNavProps) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  return (
    <div className="flex gap-6 md:gap-10">
      <Link className="hidden items-center space-x-2 md:flex" href="/">
        <span className="hidden font-bold sm:inline-block">Mapstories 2.0</span>
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
        {showMobileMenu ? 'X' : 'O'}
        <span className="font-bold">Menu</span>
      </button>
      {/* {showMobileMenu && <MobileNav items={items}>{children}</MobileNav>} */}
    </div>
  )
}
