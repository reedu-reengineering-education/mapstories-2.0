'use client'

import {
  Cog6ToothIcon,
  CreditCardIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { cx } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  {
    title: 'Mapstories',
    href: '/studio',
    icon: GlobeAltIcon,
  },
  {
    title: 'Settings',
    href: '/studio/settings',
    icon: Cog6ToothIcon,
  },
  {
    title: 'Billing',
    href: '/studio/billing',
    icon: CreditCardIcon,
    disabled: true,
  },
]

export function StudioSidebar() {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        return (
          <Link href={item.disabled ? '/' : item.href} key={index}>
            <span
              className={cx(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100',
                path === item.href ? 'bg-slate-200' : 'transparent',
                item.disabled ? 'cursor-not-allowed opacity-80' : '',
              )}
            >
              <item.icon className="mr-2 h-4 w-4 stroke-2" />
              <span>{item.title}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
