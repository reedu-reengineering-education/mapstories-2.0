'use client'

import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { DropdownMenu } from '../Dropdown'
import { UserAvatar } from './UserAvatar'

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'name' | 'image' | 'email'>
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="focus:ring-brand-900 flex items-center gap-2 overflow-hidden focus:ring-2 focus:ring-offset-2 focus-visible:outline-none">
        <UserAvatar user={{ name: user.name, image: user.image }} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="z-20 mt-2 md:w-[240px]">
          <div className="flex items-center justify-start gap-2 p-4">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && <p className="font-medium">{user.name}</p>}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-slate-600">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <Link className="w-full" href="/studio">
              Studio
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Link className="w-full" href="/studio/settings">
              Einstellungen
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item disabled>
            <Link className="w-full" href="/dashboard/billing">
              Billing
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            className="cursor-pointer"
            onSelect={event => {
              event.preventDefault()
              signOut({
                callbackUrl: `${window.location.origin}/`,
              })
            }}
          >
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
