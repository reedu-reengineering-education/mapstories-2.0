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

interface TitleContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string,
  slideContent?: any
}

type FormData = z.infer<typeof slideTitleContentSchema>

export function TitleContentEdit({
  storyStepId,
  className,
  slideContent,
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
  const [isSaving, setIsSaving] = useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    let response;

    if (slideContent) {
      slideContent.title = data.title
      response = await fetch(`/api/mapstory/step/${storyStepId}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...slideContent
        }),
      })
      setIsSaving(false);
    }
    else {
      response = await fetch(`/api/mapstory/step/${storyStepId}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data
        }),
      })
    }
    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your content was not created. Please try again',
        type: 'error',
      })
    }

    toast({
      message: 'Your content has been created.',
      type: 'success',
    })

    const newContent = (await response.json()) as SlideContent
    router.refresh()
    // router.push(`/studio/${newStory.id}`)

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
            defaultValue={slideContent ? slideContent.title : ''}
            errors={errors.title}
            label="title"
            size={32}
            {...register('title')}
          />
        </div>
        <Button disabled={isSaving} isLoading={isSaving} type="submit">
          Erstellen
        </Button>
      </div>
    </form>
  )
}
