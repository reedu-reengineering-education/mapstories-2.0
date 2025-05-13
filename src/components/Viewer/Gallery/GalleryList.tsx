'use client'

import { SlideContent, Story, StoryStep } from '@prisma/client'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Transition } from '@headlessui/react'

type Props = {
  stories: (Story & {
    steps: (StoryStep & { content: SlideContent[] })[]
  })[]
}

export function GalleryList({ stories }: Props) {
  const [isShowing, setIsShowing] = useState<boolean>(true)
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'gallery')

  return (
    <div>
      <Transition
        appear
        enter="transition duration-1000"
        enterFrom="opacity-0 -translate-x-80"
        enterTo="opacity-100"
        leave="transition-opacity duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 "
        show={isShowing}
      >
        <div className="re-basic-box relative max-h-[45%] overflow-auto bg-white p-4 lg:p-6">
          <XMarkIcon
            className="absolute right-0 top-0 m-2 h-6 w-6 cursor-pointer text-gray-500"
            onClick={() => setIsShowing(false)}
          />
          <h3 className="pb-1 lg:pb-4">{t('welcome_to_gallery')}</h3>
          <p className="text-sm lg:text-base">{t('gallery_text')}</p>
          {/* List is disabled for now, stories have popups on the globe */}
          {/* {stories.length > 0 &&
        stories.map(m => (
          <MapstoryCardGallery data-superjson key={m.id} mapstory={m} />
        ))} */}
        </div>
      </Transition>
    </div>
  )
}
