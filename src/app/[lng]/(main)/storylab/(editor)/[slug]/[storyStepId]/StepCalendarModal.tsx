'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/src/components/Modal'

import React from 'react'
// import { useUIStore } from '@/src/lib/store/ui'
import { Button } from '@/src/components/Elements/Button'
import { toast } from '@/src/lib/toast'
import useStep from '@/src/lib/api/step/useStep'
import { useForm } from 'react-hook-form'
import { DatePickerWrapper } from '@/src/components/Timeline/DatePicker/DatePickerWrapper'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { getDateFnsLocale } from '@/src/app/i18n/date-fns-locale'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'

type Props = {
  storyStepId: string
}

export default function StepCalendarModal({ storyStepId }: Props) {
  const language = useBoundStore(state => state.language)
  const { t } = useTranslation(language, 'timeline')

  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)

  const { step, updateStep } = useStep(storyStepId)

  const [date, setDate] = useState(step?.timestamp ?? new Date())

  useEffect(() => {
    setDate(new Date(step?.timestamp!) ?? new Date())
  }, [step])

  const { handleSubmit } = useForm({})

  const lng = useBoundStore(state => state.language)

  async function onSubmit() {
    setSaving(true)
    try {
      await updateStep({
        timestamp: date,
      })
      toast({
        message: t('setDateSuccess'),
        type: 'success',
      })
      setOpen(false)
    } catch (e) {
      return toast({
        title: 'Wrong',
        message: t('setDateError'),
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
        trigger={
          <Button
            className="w-full"
            startIcon={<CalendarDaysIcon className="h-6" />}
            variant={'inverse'}
          >
            {step?.timestamp != null
              ? format(new Date(step?.timestamp), 'Pp', {
                  locale: getDateFnsLocale(lng),
                })
              : 'Zeitpunkt setzen'}
          </Button>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content className="flex justify-center">
            <DatePickerWrapper date={date} setDate={date => setDate(date!)} />
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
