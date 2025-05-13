'use client'

import { Button } from '@/src/components/Elements/Button'
import { PlusIcon } from '@radix-ui/react-icons'
import CreateStepCalendarModal from './CreateStepCalendarModal'

export default function AddStoryStepTimelineButton({
  storyID,
}: {
  storyID: string
}) {
  return (
    <CreateStepCalendarModal
      storyID={storyID}
      trigger={
        <Button className="w-full">
          <PlusIcon className="w-5" />
        </Button>
      }
    />
  )
}
