'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { cx } from 'class-variance-authority'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/src/app/i18n/client'
import { useEffect, useState } from 'react'
// import { useUIStore } from '@/src/lib/store/ui'
import { Route } from '@/src/types/Routes'
import { useBoundStore } from '@/src/lib/store/store'

import { LogoWithTextAndBackground } from './MapstoriesLogo'

export function Navbar({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'navbar')

  const [routes, setRoutes] = useState<Route[]>([])

  useEffect(() => {
    setRoutes([
      {
        title: 'StoryLab',
        href: `/${lng}/studio`,
      },
      {
        title: t('viewer'),
        href: `/${lng}/viewer`,
      },
      {
        title: t('contact'),
        href: `/${lng}/contact`,
        disabled: true,
      },
      {
        title: t('about'),
        href: `/${lng}/about`,
      },
      {
        title: t('impressum'),
        href: `/${lng}/impressum`,
      },
      {
        title: t('feedback'),
        href: `/${lng}/feedback`,
      },
    ])
  }, [lng, t])

  return (
    <>
      <div className="flex gap-6 md:gap-10">
        <Link
          className="relative hidden items-center space-x-2 md:flex"
          href="/"
        >
          <LogoWithTextAndBackground />
          <span className="absolute -bottom-1 -right-8 -rotate-[17deg] font-bold text-primary">
            BETA
          </span>
        </Link>
        {routes?.length ? (
          <nav className="hidden gap-6 md:flex">
            {routes?.map((item, index) => (
              <Link
                className={cx(
                  'flex items-center text-lg font-semibold sm:text-sm',
                  item.href.includes(`/${segment}`)
                    ? 'text-slate-900'
                    : 'text-slate-600',
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
        {showMobileMenu && <MobileNav routes={routes}>{children}</MobileNav>}
      </div>
      {children}
    </>
  )
}

function MobileNav({ routes }: { children?: React.ReactNode; routes: any[] }) {
  return (
    <div
      className={cx(
        'animate-in slide-in-from-bottom-80 fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md md:hidden',
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-white p-4 shadow-md">
        <Link className="flex items-center space-x-2" href="/">
          <LogoWithTextAndBackground />
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
