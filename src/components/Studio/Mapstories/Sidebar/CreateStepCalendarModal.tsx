'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/Modal'

import React from 'react'
// import { useUIStore } from '@/src/lib/store/ui'
import { Button } from '@/src/components/Elements/Button'
import { toast } from '@/src/lib/toast'
import useStory from '@/src/lib/api/story/useStory'
import { DatePickerWrapper } from '@/src/components/Timeline/DatePicker/DatePickerWrapper'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

type Props = {
  trigger: React.ReactElement
  storyID: string
}

export default function CreateStepCalendarModal({ storyID, trigger }: Props) {
  const router = useRouter()
  const [loading, setIsLoading] = useState(false)
  const { story, createStoryStep } = useStory(storyID)

  const [open, setOpen] = useState(false)

  const [date, setDate] = useState<Date>(new Date())
  const { handleSubmit } = useForm({})

  async function onSubmit() {
    setIsLoading(true)

    try {
      const newStoryStep = await createStoryStep({
        timestamp: date,
      })
      router.replace(`/storylab/${story?.slug}/${newStoryStep.id}`)
      setOpen(false)
      setDate(new Date()) // reset date
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your step was not created. Please try again',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal onOpenChange={setOpen} open={open} title={''} trigger={trigger}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content className="flex justify-center">
            <DatePickerWrapper date={date} setDate={setDate} />
          </Modal.Content>
          <Modal.Footer>
            <Button disabled={loading} isLoading={loading} type="submit">
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
