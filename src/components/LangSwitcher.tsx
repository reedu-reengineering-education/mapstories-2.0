'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cx } from 'class-variance-authority'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { DropdownMenu } from './Dropdown'

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
]

export function LangSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const changeLanguage = (lng: string) => {
    const path = pathname?.split('/')
    if (!path) {
      return
    }

    path[1] = lng
    router.replace(path.join('/'))
    // what does that do? gives a ts error after upgrading to next v14
    // router.replace(path.join('/'), {
    //   forceOptimisticNavigation: true
    // })
  }

  const currentLang = pathname?.split('/')[1]
  const current = LANGUAGES.find(l => l.code === currentLang)

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="focus:ring-brand-900 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-offset-2 focus-visible:outline-none">
        <span className="text-base leading-none">{current?.flag}</span>
        <span>{current?.code.toUpperCase()}</span>
        <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-[100] mt-2 min-w-[160px] p-1 md:w-auto"
        >
          {LANGUAGES.map(({ code, flag, label }) => (
            <DropdownMenu.Item
              className={cx(
                'cursor-pointer gap-2 rounded-md',
                code === currentLang && 'bg-hover font-medium text-black',
              )}
              key={code}
              onClick={() => changeLanguage(code)}
            >
              <span className="text-base leading-none">{flag}</span>
              <span>{label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
