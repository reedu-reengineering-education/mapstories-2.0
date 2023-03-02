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
import { media_type, media_types } from '@/src/lib/media/media'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { Embed } from '../../embeds/Embed'

interface EmbedContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  slideContent?: any
  lng: string
}

type FormData = z.infer<typeof slideEmbedContentSchema>

export function EmbedContentEdit({
  storyStepId,
  slideContent,
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
  const [media, setMedia] = useState<media_type>(
    slideContent
      ? urlToMedia(slideContent.media)
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
      slideContent ? slideContent.storyStepId : storyStepId
    }/content`
    const method = slideContent ? 'PUT' : 'POST'
    const headers = {
      'Content-Type': 'application/json',
    }
    const body = slideContent
      ? JSON.stringify({ ...slideContent })
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

    toast({
      message: 'Your content has been created.',
      type: 'success',
    })

    router.refresh()
    // router.push(`/studio/${newStory.id}`)
  }

  async function handleUrl(url: string) {
    setMedia(urlToMedia(url))
    if (media.type != 'unknown' && slideContent) {
      slideContent.media = url
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
            defaultValue={slideContent ? slideContent.media : ''}
            errors={errors.media}
            label="media"
            size={32}
            {...register('media')}
          />
        </div>
        <div
          className="re-data-media-preview pt-4 pb-4"
          style={{ height: '50vh' }}
        >
          <Embed media={media} />
        </div>
        <Button
          disabled={media.type == 'unknown'}
          isLoading={isSaving}
          type="submit"
        >
          {slideContent && t('save')}
          {!slideContent && t('create')}
        </Button>
      </div>
    </form>
  )
}

export function urlToMedia(url: string): media_type {
  // check if url is a valid url with zod
  try {
    z.string().url().parse(url)

    // check if url ir a known media url
    for (var i = 0; i < media_types.length; i++) {
      if (url.toString().match(media_types[i].match_str)) {
        const media = { ...media_types[i] }
        media.url = url
        return media
      }
    }
    // return unknown media
    return {
      type: 'unknown',
      name: 'Unknown',
      match_str: / /,
      url: '',
    }
  } catch {
    // return unknown media
    return {
      type: 'unknown',
      name: 'Unknown',
      match_str: / /,
      url: '',
    }
  }
}
