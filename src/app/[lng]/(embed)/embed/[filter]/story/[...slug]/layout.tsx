import {
  LogoWithTextAndBackground,
  LogoWithTextTransparent,
} from '@/src/components/Layout/MapstoriesLogo'
import ViewerView from '@/src/components/Viewer/ViewerView'
import { Story } from '@prisma/client'
import { db } from '@/src/lib/db'

interface ViewerLayoutProps {
  children?: React.ReactNode
  params: { slug: string }
}

async function getStory(slug: Story['slug']) {
  return await db.story.findFirst({
    where: {
      slug: slug,
    },
    include: {
      steps: {
        include: {
          content: true,
        },
      },
    },
  })
}

export default async function EmbedLayout({
  params: { slug },
  children,
}: ViewerLayoutProps) {
  const story = await getStory(slug[0])
  // const mapstories = await getMapstories()

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 z-10 w-full">
        <header className="sticky top-0">
          <div className="flex h-16 items-center justify-between py-4 pl-6">
            {/* <LogoWithTextAndBackground /> */}
            {story?.mode === 'NORMAL' && <LogoWithTextTransparent />}
            {story?.mode === 'TIMELINE' && <LogoWithTextAndBackground />}
          </div>
        </header>
      </div>
      <div className="absolute left-0 top-0 h-full w-full">{children}</div>
      <ViewerView data-superjson inputStories={[]}></ViewerView>
    </div>
  )
}
