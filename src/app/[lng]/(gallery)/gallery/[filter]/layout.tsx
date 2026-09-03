import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'
import { InverseNavbar } from '@/src/components/Layout/InverseNavbar'
import ViewerView from '@/src/components/Viewer/ViewerView'
import { db } from '@/src/lib/db'
import { getCurrentSite } from '@/src/lib/site'
import { getCurrentUser } from '@/src/lib/session'
import { User } from '@prisma/client'
import Link from 'next/link'

const countStories = async (userId: User['id']) => {
  return await db.story.count({
    where: {
      ownerId: userId,
    },
  })
}

const getCertifiedMapstories = async (array: Array<string>) => {
  return await db.story.findMany({
    where: {
      visibility: 'PUBLIC',
      OR: [
        {
          id: {
            in: array,
          },
        },
        {
          slug: {
            in: array,
          },
        },
      ],
    },
    include: {
      firstStep: {
        include: {
          content: true,
        },
      },
      steps: {
        include: {
          content: true,
        },
      },
      theme: true,
    },
  })
}

interface ViewerLayoutProps {
  children?: React.ReactNode
  params: { filter: string }
}

export default async function ViewerLayout({ children }: ViewerLayoutProps) {
  const user = await getCurrentUser()
  const storyCount = user ? await countStories(user.id) : 0

  // Prefer gallery stories from the database, fall back to env variable
  const site = getCurrentSite()
  const dbGalleryStories = await db.galleryStory.findMany({
    where: { site },
    orderBy: { position: 'asc' },
  })

  const certifiedMapstoryIDs: Array<string> =
    dbGalleryStories.length > 0
      ? dbGalleryStories.map(gs => gs.storyId)
      : (process.env[site === 'BFDW' ? 'GALLERY_STORIES_BFDW' : 'GALLERY_STORIES'] ?? '').split(',').filter(id => id.trim())

  const mapstories = await getCertifiedMapstories(certifiedMapstoryIDs)

  // Maintain database order when stories come from the database
  const orderedMapstories =
    dbGalleryStories.length > 0
      ? certifiedMapstoryIDs
          .map(id => mapstories.find(m => m.id === id))
          .filter((m): m is (typeof mapstories)[0] => m !== undefined)
      : mapstories

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 z-50 w-full bg-opacity-50 bg-gradient-to-b from-zinc-800 to-transparent">
        <header className="container sticky top-0">
          <div className="flex h-16 items-center justify-between py-4">
            <InverseNavbar user={user} userHasStories={storyCount > 0}>
              <div className="flex space-x-2">

                <div className="hidden lg:flex lg:flex-row lg:gap-2">
                  <LangSwitcher />
                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link href="/login">
                      <Button>Login</Button>
                    </Link>
                  )}
                </div>
              </div>
            </InverseNavbar>
          </div>
        </header>
      </div>
      <div className="absolute left-0 top-0 h-full w-full">{children}</div>
      <ViewerView data-superjson inputStories={orderedMapstories}></ViewerView>
    </div>
  )
}
