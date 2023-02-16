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
import { useState } from 'react'
import { SlideContent } from '@prisma/client'
import { media_type, media_types } from '@/src/lib/media/media'
import { YouTubeEmbed } from '../../embeds/Youtube'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'

interface EmbedContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string,
  slideContent?: any,
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
  } = useForm<FormData>({
    resolver: zodResolver(slideEmbedContentSchema),
  })
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { t } = useTranslation(lng, 'editModal')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [media, setMedia] = useState<media_type>(slideContent ? urlToMedia(slideContent.media) : {
    type: 'unknown',
    name: 'Unknown',
    match_str: / /,
    url: ''
  })

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    const url = `/api/mapstory/step/${slideContent ? slideContent.storyStepId : storyStepId}/content`;
    const method = slideContent ? 'PUT' : 'POST';
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = slideContent ? JSON.stringify({ ...slideContent }) : JSON.stringify({ ...data });
    const response = await fetch(url, { method, headers, body });

    setIsSaving(false)

    if (!response?.ok) {
      debugger;
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

  async function handleUrl(url: string) {
      setMedia(urlToMedia(url))
      if (media.type != 'unknown' && slideContent) {
        slideContent.media = url;
      }
  }

  function urlToMedia(url: string): media_type {
    // check if url is a valid url with zod
    try {
      z.string().url().parse(url)

      // check if url ir a known media url
      for (var i = 0; i < media_types.length; i++) {
        if (url.toString().match(media_types[i].match_str)) {
          const media = media_types[i];
          media.url = url;
          return media;
        }
      }; 
      // return unknown media
      return {
        type: 'unknown',
        name: 'Unknown',
        match_str: / /,
        url: ''
      };
    } catch {
      // return unknown media
      return {
        type: 'unknown',
        name: 'Unknown',
        match_str: / /,
        url: ''
      };
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
          <InputLabel>Gib eine URL zu einem Social Media Beitrag ein</InputLabel>
          <Input
            defaultValue={slideContent ? slideContent.media : ''}
            errors={errors.media}
            handleChange={handleUrl}
            label="media"
            size={32}
            {...register('media')}
          />
        </div>
        <div className="re-data-media-preview">
          {media.type != 'unknown'
              ? media.type == 'youtube'
                ? <YouTubeEmbed
                  height="200" url={media.url} width="300" />
                : <p>Media not yet implemented...</p>
              : <p>Media not recognized...</p>}
        </div>
        <Button disabled={media.type == 'unknown'} isLoading={isSaving} type="submit">
          {slideContent && (t('save'))}
          {!slideContent && (t('create'))}
        </Button>
      </div>
    </form>
  )
}
