'use client'

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar } from './Auth/Avatar'
import { DropdownMenu } from './Dropdown'

export function FeedbackButton() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="focus:ring-brand-900 flex items-center gap-2 overflow-hidden focus:ring-2 focus:ring-offset-2 focus-visible:outline-none">
        <Avatar>
          <ChatBubbleOvalLeftIcon className="h-7 w-7" />
        </Avatar>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="z-20 mt-2 md:w-[240px]">
          <DropdownMenu.Item className="cursor-pointer">
            <a
              href="https://padlet.com/VamosMuenster/feedback-zur-plattform-mapstories-vxeo28o2lzldiwuy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Feedback über Padlet{' '}
            </a>
          </DropdownMenu.Item>
          {/* <DropdownMenu.Item className="cursor-pointer">
            <a
              href="https://github.com/reedu-reengineering-education/mapstories-2.0"
              rel="noopener noreferrer"
              target="_blank"
            >
              Anmerkungen zum Code{' '}
            </a>
          </DropdownMenu.Item> */}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
