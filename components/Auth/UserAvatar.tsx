import { AvatarProps } from '@radix-ui/react-avatar'

import { Avatar } from './Avatar'
import { UserIcon } from '@heroicons/react/24/outline'

interface UserAvatarProps extends AvatarProps {
  user: {
    image?: string | null
    name?: string | null
  }
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <Avatar.Image alt="Picture" src={user.image} />
      ) : (
        <Avatar.Fallback>
          <span className="sr-only">{user.name}</span>
          <UserIcon className="h-4 w-4" />
        </Avatar.Fallback>
      )}
    </Avatar>
  )
}
