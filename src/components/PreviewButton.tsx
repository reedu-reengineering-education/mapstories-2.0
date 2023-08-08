'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@/src/components/Elements/Button'
import { EyeIcon } from '@heroicons/react/24/outline'

function getSlidePositionById(story: any, slideid: any) {
  try {
    const slides = story?.story.steps
    const slidePosition = slides?.filter(
      (slide: any) => slide.id === slideid,
    )[0]
    console.log(slidePosition)
    return slidePosition.position || 'start'
  } catch (e) {
    return 'start'
  }
}
export function PreviewButton(story: any) {
  const pathname = usePathname()
  const pathnameArr = pathname?.split('/')
  if (!pathnameArr) {
    return null
  }

  const lng = pathnameArr[1]
  const previewText =
    lng === 'de' ? 'Vorschau' : lng === 'en' ? 'Preview' : 'Vista previa'

  const storyid = pathnameArr[3]
  const slideid = pathnameArr[4]
  const slidePosition = getSlidePositionById(story, slideid)

  return (
    <a href={`/mystories/story/${storyid}/${slidePosition}`} target="_blank">
      <Button
        className="re-basic-box"
        startIcon={<EyeIcon className="w-5" />}
        variant={'inverse'}
      >
        {previewText}
      </Button>
    </a>
  )
}
