'use client'

import { StoryOverviewControls } from '@/src/components/Viewer/StoryOverviewContols'
import QuitStoryButton from './QuitStoryButton'
import PlayStoryButton from './PlayStoryButton'
import { StoryLanguageSwitcher } from './StoryLanguageSwitcher'
import { AddTranslationButton } from './AddTranslationButton'

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
  return (
    <>
      <div className="hidden  md:flex re-basic-box z-[60] h-fit max-h-full w-[55%] overflow-auto bg-white px-4 lg:max-w-[50%]">
        <div className="flex w-full flex-col py-2">
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
      </div>
      <div className="re-basic-box absolute bottom-10 right-[50%] z-50 md:flex overflow-auto hidden lg:flex lg:flex-row ">
        <QuitStoryButton size="s" slug={slug[0]} />
        <PlayStoryButton size="s" slug={slug[0]} />
      </div>

    </>
  )
}
