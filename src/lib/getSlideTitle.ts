import { SlideContent } from '@prisma/client'

export function getSlideTitle(content: SlideContent[]) {
  const title = content.filter((item: SlideContent) => item.type === 'TITLE')
  if (title.length > 0) {
    const firstTitle = title.reduce((prev, current) => {
      return prev.position < current.position ? prev : current
    })
    return firstTitle?.content ?? 'No title'
  }
  return 'No title'
}
