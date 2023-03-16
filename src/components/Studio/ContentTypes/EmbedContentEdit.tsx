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

interface EmbedContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  stepItem?: any
  lng: string
}

type FormData = z.infer<typeof slideEmbedContentSchema>

export function EmbedContentEdit({
  storyStepId,
  stepItem,
  className,
  lng,
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
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { media: url } = watch()
  useEffect(() => {
    handleUrl(url)
  }, [url])

  const { t } = useTranslation(lng, 'editModal')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [media, setMedia] = useState<media_type | null>(
    stepItem ? stepItem : null,
  )

  async function onSubmit(data: FormData) {
    if (media) {
      setIsSaving(true)
      const url = `/api/mapstory/step/${
        stepItem ? stepItem.storyStepId : storyStepId
      }/content`
      const method = stepItem ? 'PUT' : 'POST'
      const headers = {
        'Content-Type': 'application/json',
      }
      let body
      if (stepItem) {
        body = JSON.stringify({ ...stepItem })
      } else {
        body = JSON.stringify({
          content: data.media,
          type: media.type,
        })
      }
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
    } else {
      toast({
        message: 'The embedded media is not recognized.',
        type: 'error',
      })
    }
  }

  async function handleUrl(url: string) {
    setMedia(urlToMedia(url))
    if (url && media && stepItem) {
      stepItem.content = url
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
            defaultValue={stepItem ? stepItem.content : ''}
            errors={errors.media}
            label="media"
            size={32}
            {...register('media')}
          />
        </div>
        <div className="re-data-media-preview pt-4 pb-4">
          <Embed height="50vh" media={media} />
          {
            media && media.type == 'YOUTUBE' && <div>autoplay option</div>
            // <Input
            //   defaultValue={stepItem ? stepItem.media.options.autoplay : ''}
            //   errors={errors.media}
            //   label="autoplay"
            //   size={32}
            //   {...register('autoplay')}
            // />
          }
        </div>
        <Button disabled={media == null} isLoading={isSaving} type="submit">
          {stepItem && t('save')}
          {!stepItem && t('create')}
        </Button>
      </div>
    </form>
  )
}
