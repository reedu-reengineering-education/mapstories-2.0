'use client'

import { usePathname } from 'next/navigation'
import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import { useBoundStore } from '@/src/lib/store/store'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useTranslation } from '@/src/app/i18n/client'
import QuitStoryButton from './QuitStoryButton'
import PlayStoryButton from './PlayStoryButton'
import { StoryLanguageSwitcher } from './StoryLanguageSwitcher'
import { AddTranslationButton } from './AddTranslationButton'
import { ViewerBoxFooter } from './ViewerBoxFooter'

interface ViewerStartViewProps {
  slug: string[]
  story: any
  tags: string[]
  currentUserId?: string
}

export function ViewerStartView({
  slug,
  story,
  tags,
  currentUserId,
}: ViewerStartViewProps) {
  const path = usePathname()
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  // @ts-ignore useTranslation type overloads are complex
  const { t } = useTranslation(lng, 'viewer')
  const isEmbed = path?.includes('/embed/')

  return (
    <div className="re-basic-box z-[60] hidden h-fit max-h-full w-[55%] flex-col overflow-hidden bg-white md:flex lg:max-w-[50%]">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-2">
        <div className="flex items-center justify-end gap-2">
          <AddTranslationButton currentUserId={currentUserId} story={story} />
          <StoryLanguageSwitcher currentSlug={slug} story={story} />
        </div>
        <StoryOverviewControls
          page={slug[1]}
          slug={slug[0]}
          story={story}
          tags={tags}
        />
      </div>
      {story && (
        <ViewerBoxFooter>
          {isEmbed ? (
            <span />
          ) : (
            <QuitStoryButton label={t('close')} slug={slug[0]} />
          )}
          {story.steps?.length > 0 && (
            <PlayStoryButton label={t('play')} slug={slug[0]} />
          )}
        </ViewerBoxFooter>
      )}
    </div>
  )
}
