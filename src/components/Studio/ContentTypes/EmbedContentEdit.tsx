'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

import { toast } from '@/src/lib/toast'
import { Button } from '@/src/components/Elements/Button'
import { cx } from 'class-variance-authority'
import { slideEmbedContentSchema } from '@/src/lib/validations/slidecontent'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { media_type } from '@/src/lib/media/media'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { Embed } from '../../embeds/Embed'
import { SlideContent } from '@prisma/client'
import { urlToMedia } from '../../HelperFunctions'
import { useUIStore } from '@/src/lib/store/language'

interface EmbedContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  stepItem?: any
}

type FormData = z.infer<typeof slideEmbedContentSchema>

export function EmbedContentEdit({
  storyStepId,
  stepItem,
  className,
  ...props
}: EmbedContentEditProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(slideEmbedContentSchema),
  })
  let lng = useUIStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { media: url } = watch()
  useEffect(() => {
    handleUrl(url)
  }, [url])

  const { t } = useTranslation(lng, 'editModal')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [media, setMedia] = useState<media_type>(
    stepItem
      ? urlToMedia(stepItem.media)
      : {
          type: 'unknown',
          name: 'Unknown',
          match_str: / /,
          url: '',
        },
  )

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    const url = `/api/mapstory/step/${
      stepItem ? stepItem.storyStepId : storyStepId
    }/content`
    const method = stepItem ? 'PUT' : 'POST'
    const headers = {
      'Content-Type': 'application/json',
    }
    const body = stepItem
      ? JSON.stringify({ ...stepItem })
      : JSON.stringify({ ...data })
    const response = await fetch(url, { method, headers, body })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your content was not created. Please try again',
        type: 'error',
      })
    }

    const newContent = (await response.json()) as SlideContent

    toast({
      message: 'Your content has been created.',
      type: 'success',
    })

    router.refresh()
    // router.push(`/studio/${newStory.id}`)
  }

  async function handleUrl(url: string) {
    setMedia(urlToMedia(url))
    if (url && media.type != 'unknown' && stepItem) {
      stepItem.media = url
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
          <InputLabel>
            Gib eine URL zu einem Social Media Beitrag ein
          </InputLabel>
          <Input
            defaultValue={stepItem ? stepItem.media : ''}
            errors={errors.media}
            label="media"
            size={32}
            {...register('media')}
          />
        </div>
        <div className="re-data-media-preview pt-4 pb-4">
          <Embed height="50vh" media={media} />
        </div>
        <Button
          disabled={media.type == 'unknown'}
          isLoading={isSaving}
          type="submit"
        >
          {stepItem && t('save')}
          {!stepItem && t('create')}
        </Button>
      </div>
    </form>
  )
}
