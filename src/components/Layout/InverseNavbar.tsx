'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { cx } from 'class-variance-authority'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/src/app/i18n/client'
import { Fragment, useEffect, useState } from 'react'
// import { useUIStore } from '@/src/lib/store/ui'
import { Route } from '@/src/types/Routes'
import { useBoundStore } from '@/src/lib/store/store'
import { LogoWithTextTransparent } from './MapstoriesLogo'
import { User } from 'next-auth'
import { LangSwitcher } from '../LangSwitcher'
import { UserAccountNav } from '../Auth/UserAccountNav'
import { Button } from '../Elements/Button'

export function InverseNavbar({
  children,
  user,
  userHasStories,
}: {
  children: React.ReactNode
  userHasStories: boolean
  user:
    | (User & {
        id: string
      })
    | undefined
}) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'navbar')

  const [routes, setRoutes] = useState<Route[]>([])

  useEffect(() => {
    setRoutes([
      {
        title: 'StoryLab',
        href: `/${lng}/storylab`,
      },
      {
        title: t('viewer'),
        href: `/${lng}/mystories/all`,
        disabled: user === undefined || !userHasStories,
      },
      {
        title: t('gallery'),
        href: `/${lng}/gallery/all`,
      },
      {
        title: t('about'),
        href: `/${lng}/about`,
      },
    ])
  }, [lng, t])

  return (
    <>
      <div className="flex gap-6 lg:gap-10">
        <Link
          className="relative hidden items-center space-x-2 text-zinc-50 lg:flex"
          href="/"
        >
          <LogoWithTextTransparent />
          <span className="absolute -bottom-1 -right-8 -rotate-[17deg] font-bold text-primary">
            BETA
          </span>
        </Link>
        {routes?.length ? (
          <nav className="hidden gap-6 lg:flex">
            {routes?.map((item, index) => (
              <Fragment key={index}>
                {!item.disabled && (
                  <Link
                    className={cx(
                      'flex items-center text-lg font-semibold sm:text-sm',
                      item.href.includes(`/${segment}`)
                        ? 'text-slate-50'
                        : 'text-slate-100',
                      item.disabled ? 'cursor-not-allowed opacity-80' : '',
                    )}
                    href={item.disabled ? '#' : item.href}
                  >
                    {item.title}
                  </Link>
                )}
              </Fragment>
            ))}
          </nav>
        ) : null}
        <button
          className="flex items-center space-x-2 text-white lg:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <XMarkIcon className="w-5" />
          ) : (
            <Bars3Icon className="w-5" />
          )}
        </button>
        <Link
          className="relative items-center space-x-2 text-zinc-50 lg:hidden"
          href="/"
        >
          <LogoWithTextTransparent />
          <span className="absolute -bottom-1 -right-8 hidden -rotate-[17deg] font-bold text-primary lg:flex">
            BETA
          </span>
        </Link>
        {showMobileMenu && (
          <MobileNav routes={routes} user={user}>
            {children}
          </MobileNav>
        )}
      </div>

      {children}
    </>
  )
}

function MobileNav({
  routes,
  user,
}: {
  children?: React.ReactNode
  routes: any[]
  user: any
}) {
  return (
    <div
      className={cx(
        'animate-in slide-in-from-bottom-80 fixed inset-0 top-16 grid h-[calc(100vh-4rem)] w-[40%] grid-flow-row auto-rows-max overflow-hidden p-6 pb-32 lg:hidden',
      )}
    >
      <div className="relative grid gap-6 rounded-md bg-white p-4">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          <div className="flex flex-row gap-6">
            <LangSwitcher />
            {user ? (
              <UserAccountNav user={user} />
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>

          {routes.map((item, index) => (
            <Link
              className={cx(
                'flex w-full items-center rounded-md py-2 text-sm font-medium hover:underline',
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
