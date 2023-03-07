'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

import { toast } from '@/src/lib/toast'
import { Button } from '@/src/components/Elements/Button'
import { cx } from 'class-variance-authority'
import { slideTitleContentSchema } from '@/src/lib/validations/slidecontent'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SlideContent } from '@prisma/client'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'

interface TitleContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  stepItem?: any
  lng: string
}

type FormData = z.infer<typeof slideTitleContentSchema>

export function TitleContentEdit({
  storyStepId,
  className,
  stepItem,
  lng,
  ...props
}: TitleContentEditProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(slideTitleContentSchema),
  })
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { t } = useTranslation(lng, 'editModal')

  const [isSaving, setIsSaving] = useState<boolean>(false)

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true)
      const url = `/api/mapstory/step/${
        stepItem ? stepItem.storyStepId : storyStepId
      }/content`
      const method = stepItem ? 'PUT' : 'POST'
      const headers = {
        'Content-Type': 'application/json',
      }
      const body = stepItem
        ? JSON.stringify({ ...stepItem, title: data.title })
        : JSON.stringify({ ...data })
      const response = await fetch(url, { method, headers, body })

      setIsSaving(false)

      if (!response.ok) {
        return toast({
          title: 'Something went wrong.',
          message: 'Your content was not created. Please try again.',
          type: 'error',
        })
      }
      //@ts-ignore
      const newContent = (await response.json()) as SlideContent

      toast({
        message: 'Your content has been created.',
        type: 'success',
      })

      router.refresh()
    } catch (error:any) {
      toast({
        title: 'Something went wrong.',
        message: error.message,
        type: 'error',
      })
    }
  }

  return (
    <form
      className={cx(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="top-0">
        <div className="pt-4">
          <InputLabel>Gib eine Überschrift für deine Folie ein</InputLabel>
          <Input
            defaultValue={stepItem ? stepItem.title : ''}
            errors={errors.title}
            label="title"
            size={32}
            {...register('title')}
          />
        </div>
        <Button disabled={isSaving} isLoading={isSaving} type="submit">
          {stepItem && t('save')}
          {!stepItem && t('create')}
        </Button>
      </div>
    </form>
  )
}
