'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useBoundStore } from '@/src/lib/store/store'
import { SlideContent } from '@prisma/client'

type PreviewSlideButtonProps = {
  content: SlideContent[] | null
}

export default function PreviewSlideButton({
  content,
}: PreviewSlideButtonProps) {
  const { showSlidePreview, setShowSlidePreview } = useBoundStore()
  if (content && content.length > 0) {
    if (showSlidePreview) {
      return (
        <EyeIcon
          className="absolute top-0 right-0 m-2 w-5 hover:cursor-pointer"
          onClick={() => setShowSlidePreview(false)}
        />
      )
    }
    return (
      <EyeSlashIcon
        className="absolute top-0 right-0 m-2 w-5 hover:cursor-pointer"
        onClick={() => setShowSlidePreview(true)}
      />
    )
  }

  return null
}
