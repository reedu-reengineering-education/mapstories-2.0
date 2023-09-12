'use client'

import { SlideContent, Story, StoryStep } from '@prisma/client'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'

type Props = {
  stories: (Story & {
    steps: (StoryStep & { content: SlideContent[] })[]
  })[]
}

export function GalleryList({ stories }: Props) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'gallery')

  return (
    <div className="re-basic-box max-h-[70VH] max-w-[50%] overflow-auto bg-white p-6">
      <h3 className="pb-4">{t('welcome_to_gallery')}</h3>
      <p>{t('gallery_text')}</p>
      {/* List is disabled for now, stories have popups on the globe */}
      {/* {stories.length > 0 &&
        stories.map(m => (
          <MapstoryCardGallery data-superjson key={m.id} mapstory={m} />
        ))} */}
    </div>
  )
}
