'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/Modal'

import React from 'react'
// import { useUIStore } from '@/src/lib/store/ui'
import { Button } from '@/src/components/Elements/Button'
import { toast } from '@/src/lib/toast'
import useStep from '@/src/lib/api/step/useStep'
import { useForm } from 'react-hook-form'
import { DatePickerWrapper } from '@/src/components/Timeline/DatePicker/DatePickerWrapper'

type Props = {
  trigger: React.ReactElement
  storyStepId: string
  defaultDate?: Date
}

export default function StepCalendarModal({
  trigger,
  storyStepId,
  defaultDate,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)

  const { updateStep } = useStep(storyStepId)

  const [date, setDate] = useState(defaultDate)

  const { handleSubmit } = useForm({})

  async function onSubmit() {
    setSaving(true)
    try {
      await updateStep({
        timestamp: date,
      })
      toast({
        message: 'Saved',
        type: 'success',
      })
      setOpen(false)
    } catch (e) {
      return toast({
        title: 'Wrong',
        message: 'Kaputt',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Modal
        onOpenChange={setOpen}
        open={open}
        title={'Zeitpunkt'}
        trigger={trigger}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content className="flex justify-center">
            <DatePickerWrapper date={defaultDate} setDate={setDate} />
          </Modal.Content>
          <Modal.Footer>
            <Button disabled={saving} isLoading={saving} type="submit">
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
