'use client'

import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/src/components/Elements/drawer'
import { Slide } from './Slide'
import { usePathname, useRouter } from 'next/navigation'
import * as Toolbar from '@radix-ui/react-toolbar'
import { PlayIcon, ReloadIcon } from '@radix-ui/react-icons'
import { ListChecksIcon } from 'lucide-react'

interface MobileControlsProps {
  slug: string
  page: string
  story: any
  tags: string[]
}

export function MobileControls({ slug, page, story, tags: _tags }: MobileControlsProps) {
  const [open, setOpen] = useState(true)
  const [snap, setSnap] = useState<number | string | null>(0.5)
  const router = useRouter()
  const path = usePathname()

  // Get the current step based on page
  const currentStep = page === 'start' 
    ? story?.firstStep 
    : story?.steps?.[parseInt(page)]

  function startStory() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'
    router.push(`/${pathLocal}/${slug}/0`)
  }

  function backToStart() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'
    router.push(`/${pathLocal}/${slug}/start`)
  }

  return (
    <>
    <Drawer
      activeSnapPoint={snap}
      dismissible={false}
      modal={false}
      onOpenChange={setOpen}
      open={open}
      setActiveSnapPoint={setSnap}
      snapPoints={[0.5, 1.0]}
    >
      <DrawerContent className="absolute z-[60] md:hidden re-basic-box pointer-events-auto bg-white !rounded-b-none border-b-0 flex flex-col after:hidden">
        <DrawerHeader className="shrink-0">
          <hr style={{
            borderTop: '10px solid #D9D9D9',
            borderRadius: '5px',
            width: '50px',
            margin: '0 auto 10px auto',
          }}>
          </hr>
          <DrawerTitle  className="enable-theme-font text-4xl">{story?.name}</DrawerTitle>

        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 min-h-0">
          <Slide step={currentStep} />
        </div>

        <div className="shrink-0 border-t-2 bg-white p-4">
          <Toolbar.Root
            aria-label="Story Controls"
            className="flex justify-center gap-2"
          >
            <Toolbar.ToggleGroup
              aria-label="Viewer Controls"
              className="flex gap-2"
              type="single"
            >
              {page !== 'start' && (
                <Toolbar.Button
                  aria-label="Restart story"
                  className="re-basic-box flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
                  onClick={backToStart}
                  title="Restart Story"
                >
                  <ReloadIcon className="h-5 w-5" />
                  <span className="text-sm">Reset</span>
                </Toolbar.Button>
              )}
              {page === 'start' && (
                <Toolbar.Button
                  aria-label="Start story"
                  className="re-basic-box flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
                  onClick={startStory}
                  title="Start Story"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span className="text-sm">Start</span>
                </Toolbar.Button>
              )}
              <Toolbar.Button
                aria-label="Show steps"
                className="re-basic-box flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
                title="Steps"
              >
                <ListChecksIcon className="h-5 w-5" />
                <span className="text-sm">Schritte</span>
              </Toolbar.Button>
            </Toolbar.ToggleGroup>
          </Toolbar.Root>
        </div>
      </DrawerContent>
    </Drawer>
    </>
  )
}