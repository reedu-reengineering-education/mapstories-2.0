'use client'

import { useState } from 'react'
import { cx } from 'class-variance-authority'
import { ListBulletIcon } from '@radix-ui/react-icons'
import { Slides } from '@/src/components/Viewer/Slides'
import { StorySlideListViewer } from '@/src/components/Viewer/StorySlideListViewer'
import SlidesOverview from './SlidesOverview'
import RestartStoryButton from './RestartStoryButton'
import QuitStoryButton from './QuitStoryButton'
import AddCommunityStep from './CommunityStep/AddCommunityStep'

interface ViewerStepViewProps {
  slug: string[]
  story: any
  lng: string
}

export function ViewerStepView({ slug, story, lng }: ViewerStepViewProps) {
  const [showSlides, setShowSlides] = useState<boolean>(true)

  return (
    <div className="re-basic-box z-[60] max-h-full w-[55%] self-start overflow-x-auto bg-white px-4 pb-4 lg:w-[50%]">
      {/* Toolbar */}
      <div className="sticky top-0 flex flex-row justify-evenly bg-white py-2">
        <div>
          <button
            className="flex items-center"
            onClick={() => setShowSlides(!showSlides)}
          >
            <ListBulletIcon className="h-8 w-8" />
          </button>
          <div className="absolute top-0 px-16">
            <StorySlideListViewer
              filter={'all'}
              page={slug[1]}
              slidesOpen={false}
              slug={slug[0]}
              story={story}
            />
          </div>
        </div>

        <RestartStoryButton size="xs" slug={slug[0]} />
        <QuitStoryButton size="xs" slug={slug[0]} />
        {story.community && (
          <AddCommunityStep size="xs" slug={slug[1]} story={story} />
        )}
      </div>

      {/* Content Area */}
      <div className="max-w-full overflow-y-auto overflow-x-hidden lg:h-full">
        <div className={cx(showSlides ? 'flex' : 'hidden')}>
          <Slides page={slug[1]} slug={slug[0]} story={story} />
        </div>
        <div className={cx(showSlides ? 'hidden' : 'flex')}>
          <SlidesOverview lng={lng} page={slug[1]} slug={slug[0]} story={story} />
        </div>
      </div>
    </div>
  )
}
