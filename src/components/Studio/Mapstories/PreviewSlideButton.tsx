'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useStoryStore } from '@/src/lib/store/story'

export default function PreviewSlideButton() {
  const { showSlidePreview, setShowSlidePreview } = useStoryStore()
  return (
    <>
      {showSlidePreview ? (
        <EyeIcon
          className="absolute top-0 right-0 m-2 w-5 hover:cursor-pointer"
          onClick={() => setShowSlidePreview(false)}
        />
      ) : (
        <EyeSlashIcon
          className="absolute top-0 right-0 m-2 w-5 hover:cursor-pointer"
          onClick={() => setShowSlidePreview(true)}
        />
      )}
    </>
  )
}
