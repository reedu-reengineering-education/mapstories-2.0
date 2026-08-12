'use client'

import { useTranslation } from '@/src/app/i18n/client'
// import { useUIStore } from '@/src/lib/store/ui'
import { 
  ArrowPathIcon, 
  ChartBarIcon,
  Cog6ToothIcon, 
  DocumentDuplicateIcon, 
  GlobeAltIcon,
  LockClosedIcon,
  SparklesIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { cx } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Route } from '@/src/types/Routes'
import { useBoundStore } from '@/src/lib/store/store'
import { useCurrentUser } from '@/src/lib/hooks/useCurrentUser'

export function StudioSidebar() {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'settings')
  const { isAdmin } = useCurrentUser()
  const [items, setItems] = useState<Route[]>([])

  useEffect(() => {

    const baseItems: Route[] = [
      {
        title: 'Mapstories',
        href: '/storylab',
        icon: GlobeAltIcon,
      },
      {
        title: t('settings'),
        href: `/${lng}/storylab/settings`,
        icon: Cog6ToothIcon,
      },
      {
        title: 'Privacy Settings',
        href: `/${lng}/storylab/privacy`,
        icon: LockClosedIcon,
      }
    ]

    if (isAdmin) {
      baseItems.push({
        title: 'Analytics',
        href: `/${lng}/storylab/admin/analytics`,
        icon: ChartBarIcon,
      })
      baseItems.push({
        title: 'Gallery',
        href: `/${lng}/storylab/admin/gallery`,
        icon: SparklesIcon,
      })
      baseItems.push({
        title: 'Duplicate Story',
        href: `/${lng}/storylab/admin/duplicate-story`,
        icon: DocumentDuplicateIcon,
      })
      baseItems.push({
        title: 'Transfer Story',
        href: `/${lng}/storylab/admin/transfer-story`,
        icon: ArrowPathIcon,
      })
      baseItems.push({
        title: 'Delete Story',
        href: `/${lng}/storylab/admin/delete-story`,
        icon: TrashIcon,
      })
    }
    setItems(baseItems)
  }, [lng, t, isAdmin])
  
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
                path?.endsWith(item.href) ? 'bg-slate-200' : 'transparent',
                item.disabled ? 'cursor-not-allowed opacity-80' : '',
              )}
            >
              {item.icon && (
                <>
                  <item.icon className="mr-2 h-4 w-4 stroke-2" />
                  <span>{item.title}</span>
                </>
              )}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
