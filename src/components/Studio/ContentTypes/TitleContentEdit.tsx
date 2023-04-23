'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { toast } from '@/src/lib/toast'
import { Button } from '@/src/components/Elements/Button'
import { cx } from 'class-variance-authority'
import { slideTitleContentSchema } from '@/src/lib/validations/slidecontent'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import useStep from '@/src/lib/api/step/useStep'

interface TitleContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  stepItem?: any
  setContentType?: any
}

type FormData = z.infer<typeof slideTitleContentSchema>

export function TitleContentEdit({
  storyStepId,
  className,
  stepItem,
  setContentType,
  ...props
}: TitleContentEditProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(slideTitleContentSchema),
  })
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'editModal')

  const [isSaving, setIsSaving] = useState<boolean>(false)

  const { addContent, updateContent } = useStep(storyStepId)

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true)
      if (stepItem) {
        await updateContent(stepItem.id, {
          ...stepItem,
          content: data.title,
          type: 'TITLE',
        })
        toast({
          message: t('content_updated'),
          type: 'success',
        })
      } else {
        await addContent({ content: data.title, type: 'TITLE' })
        toast({
          message: t('content_created'),
          type: 'success',
        })
      }
    } catch (error) {
      toast({
        title: t('something_wrong'),
        message: t('content_not_created'),
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
    setContentType && setContentType('')
  }

  return (
    <form
      className={cx(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="top-0">
        <div className="pt-4">
          <InputLabel>{t('headline_for_your_slide')}</InputLabel>
          <Input
            defaultValue={stepItem ? stepItem.content : ''}
            errors={errors.title}
            label="title"
            size={100}
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
