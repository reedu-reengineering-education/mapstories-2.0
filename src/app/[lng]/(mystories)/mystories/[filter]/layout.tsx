import { UserAccountNav } from '@/src/components/Auth/UserAccountNav'
import { Button } from '@/src/components/Elements/Button'
import { LangSwitcher } from '@/src/components/LangSwitcher'

import { InverseNavbar } from '@/src/components/Layout/InverseNavbar'
import ViewerView from '@/src/components/Viewer/ViewerView'
import { db } from '@/src/lib/db'
import { getCurrentUser, getSession } from '@/src/lib/session'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LinkIcon } from '@heroicons/react/24/outline'
import { User } from '@prisma/client'

interface ViewerLayoutProps {
  children?: React.ReactNode
  params: { filter: string }
}

const getMapstories = async (userId: string) => {
  return await db.story.findMany({
    where: {
      ownerId: userId,
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

const getMapstoriesWithFilter = async (userId: string, filter: string[]) => {
  const unfilteredStories = await db.story.findMany({
    where: {
      ownerId: userId,
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
  const filteredStories = unfilteredStories.map(story => {
    const filteredSteps = story.steps.filter(step =>
      filter.every(tag => step.tags.includes(tag)),
    )
    const filteredStepsNewPosition = filteredSteps.map((step, index) => {
      const newStep = { ...step, position: index }
      return newStep
    })

    return { ...story, steps: filteredStepsNewPosition }
  })

  return filteredStories
}

const countStories = async (userId: User['id']) => {
  return await db.story.count({
    where: {
      ownerId: userId,
    },
  })
}

export default async function ViewerLayout({
  children,
  params: { filter },
}: ViewerLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  const session = await getSession()

  let mapstories
  const filterArray = filter.split('-')

  if (filterArray[0] === 'all') {
    mapstories = await getMapstories(user.id)
  } else {
    mapstories = await getMapstoriesWithFilter(user.id, filterArray)
  }
  const storyCount = await countStories(user.id)

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 z-10 w-full bg-opacity-50 bg-gradient-to-b from-zinc-800 to-transparent">
        <header className="container sticky top-0">
          <div className="flex h-16 items-center justify-between py-4">
            <InverseNavbar user={user} userHasStories={storyCount > 0}>
              <div className="flex space-x-2">
                <Button
                  className="mr-20 hidden h-8 bg-zinc-700 opacity-90 hover:bg-zinc-100 lg:flex"
                  startIcon={<LinkIcon className="w-5" />}
                >
                  {' '}
                  <a
                    href="https://padlet.com/VamosMuenster/feedback-zur-plattform-mapstories-vxeo28o2lzldiwuy"
                    target="_blank"
                  >
                    {' '}
                    Feedback
                  </a>{' '}
                </Button>{' '}
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
      <ViewerView data-superjson inputStories={mapstories}></ViewerView>
    </div>
  )
}
