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
import { urlToMedia } from '../../HelperFunctions'
import { useStoryStore } from '@/src/lib/store/story'
import useStep from '@/src/lib/api/step/useStep'

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

  const storyId = useStoryStore(store => store.storyID)

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

  const { addContent, updateContent } = useStep(storyStepId)

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true)
      if (stepItem) {
        await updateContent(stepItem)
        toast({
          message: 'Your content has been updated.',
          type: 'success',
        })
      } else {
        await addContent(data)
        toast({
          message: 'Your content has been created.',
          type: 'success',
        })
      }

      router.refresh()
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        message: 'Your content was not created. Please try again.',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
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
