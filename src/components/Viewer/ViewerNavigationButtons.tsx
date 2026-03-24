'use client'

import { SingleStepBackButton } from '@/src/components/Viewer/SingleStepBackButton'
import { SingleStepForwardButton } from '@/src/components/Viewer/SingleStepForwardButton'

interface ViewerNavigationButtonsProps {
  page: string
  slug: string
  story: any
  variant?: 'navbar' | 'primary'
  position?: 'sides' | 'inline'
}

export function ViewerNavigationButtons({
  page,
  slug,
  story,
  variant = 'navbar',
  position = 'sides',
}: ViewerNavigationButtonsProps) {
  if (position === 'sides') {
    return (
      <>
        <div className="hidden lg:block absolute bottom-[50%] left-1 z-10">
          <SingleStepBackButton
            page={page}
            slug={slug}
            story={story}
            variant={variant}
          />
        </div>
        <div className="hidden lg:block absolute bottom-[50%] right-1 z-20">
          <SingleStepForwardButton
            page={page}
            slug={slug}
            story={story}
            variant={variant}
          />
        </div>
      </>
    )
  }

  // Inline layout for timeline
  return (
    <>
      <div className="z-20 hidden lg:block">
        <SingleStepBackButton
          page={page}
          slug={slug}
          story={story}
          variant={variant}
        />
      </div>
      <div className="z-20 hidden lg:block">
        <SingleStepForwardButton
          page={page}
          slug={slug}
          story={story}
          variant={variant}
        />
      </div>
    </>
  )
}
