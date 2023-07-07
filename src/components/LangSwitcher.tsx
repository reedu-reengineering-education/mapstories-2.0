'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Avatar } from './Auth/Avatar'
import { DropdownMenu } from './Dropdown'

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
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="focus:ring-brand-900 flex items-center gap-2 overflow-hidden focus:ring-2 focus:ring-offset-2 focus-visible:outline-none">
        <Avatar>{pathname?.split('/')[1].toUpperCase()} </Avatar>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="z-20 mt-2 md:w-[240px]">
          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={() => changeLanguage('de')}
          >
            🇩🇪 DE
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={() => changeLanguage('en')}
          >
            🇬🇧 EN
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={() => changeLanguage('es')}
          >
            🇪🇸 ES
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={() => changeLanguage('fr')}
          >
            🇫🇷 FR
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
