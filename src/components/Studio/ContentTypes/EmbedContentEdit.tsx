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
import { useBoundStore } from '@/src/lib/store/store'
import { useStoryStore } from '@/src/lib/store/story'
import useStep from '@/src/lib/api/step/useStep'
import { urlToMedia } from '../../../helper/urlToMedia'

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
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { content: url } = watch()
  useEffect(() => {
    handleUrl(url)
  }, [url])

  const storyId = useStoryStore(store => store.storyID)
  const { options: options } = watch()
  useEffect(() => {
    setOptionState(options)
    if (options && media && stepItem) {
      stepItem.options = options
    }
  }, [options?.autoplay])

  const { t } = useTranslation(lng, 'editModal')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [media, setMedia] = useState<media_type | undefined>(stepItem)
  const [optionState, setOptionState] = useState(stepItem?.options)

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
    const new_media = urlToMedia(url)
    setMedia(new_media)
    if (new_media && url && stepItem) {
      if (stepItem) {
        stepItem.content = url
      }
    }
    if (new_media?.type == 'YOUTUBE' && !optionState) {
      setOptionState({ autoplay: false })
    } else if (new_media && new_media.type != 'YOUTUBE' && optionState) {
      setOptionState(null)
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
          <Input
            defaultValue={stepItem ? stepItem.content : ''}
            errors={errors.content}
            label="content"
            size={32}
            {...register('content')}
          />
          <InputLabel>
            Gib eine URL zu einem Social Media Beitrag ein
          </InputLabel>
        </div>
        <div className="re-data-media-preview pt-4 pb-4">
          <Embed
            height="50vh"
            media={media}
            options={optionState ? optionState : undefined}
          />
          {media?.type == 'YOUTUBE' && optionState?.autoplay != undefined && (
            <div className="flex items-center">
              <Input
                defaultChecked={optionState.autoplay}
                label="autoplay"
                type="checkbox"
                {...register('options.autoplay')}
              />
              <InputLabel>Autoplay</InputLabel>
            </div>
          )}
        </div>
        <Button disabled={media == null} isLoading={isSaving} type="submit">
          {stepItem && t('save')}
          {!stepItem && t('create')}
        </Button>
      </div>
    </form>
  )
}
