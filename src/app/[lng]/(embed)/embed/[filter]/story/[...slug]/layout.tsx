import { LogoWithTextTransparent } from '@/src/components/Layout/MapstoriesLogo'
import { db } from '@/src/lib/db'

interface ViewerLayoutProps {
  children?: React.ReactNode
  params: { slug: string }
}

async function getStory(slug: string) {
  return await db.story.findFirst({
    where: {
      OR: [{ id: slug }, { slug: slug }],
    },
    include: {
      steps: {
        include: {
          content: true,
        },
      },
      theme: true,
    },
  })
}

export default async function EmbedLayout({
  params: { slug },
  children,
}: ViewerLayoutProps) {
  const story = await getStory(slug[0])

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 z-10 w-full">
        <header className="sticky top-0">
          <div className="flex h-16 items-center justify-between py-4 pl-6">
            {/* <LogoWithTextAndBackground /> */}
            {story?.mode === 'NORMAL' && <LogoWithTextTransparent />}
            {story?.mode === 'TIMELINE' && 'MAPSTORIES ZEITGEISTY'}
          </div>
        </header>
      </div>
      <div className="absolute left-0 top-0 h-full w-full">{children}</div>
    </div>
  )
}
