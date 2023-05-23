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
import { useBoundStore } from '@/src/lib/store/store'
import useStep from '@/src/lib/api/step/useStep'
import { urlToMedia } from '../../../helper/urlToMedia'
import MediaIconList from '../Mapstories/MediaPlatformIcons'

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

  const storyId = useBoundStore(store => store.storyID)
  const { options: options } = watch()
  useEffect(() => {
    setOptionState(options)
    if (options && media && stepItem) {
      stepItem.options = options
    }
  }, [options?.autoplay])

  const { t } = useTranslation(lng, ['editModal', 'embeds'])
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [media, setMedia] = useState<media_type | undefined>(stepItem)
  const [optionState, setOptionState] = useState(stepItem?.options)

  const { addContent, updateContent } = useStep(storyStepId)

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true)
      if (stepItem) {
        await updateContent(stepItem.id, { ...stepItem, type: media?.type })
        toast({
          message: t('editModal:contentUpdated'),
          type: 'success',
        })
      } else {
        await addContent({ ...data, type: media?.type })
        toast({
          message: t('editModal:contentCreated') as string,
          type: 'success',
        })
      }
    } catch (error) {
      toast({
        title: t('editModal:somethingWrong') as string,
        message: t('editModal:contentNotCreated') as string,
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
        <InputLabel>{t('embeds:EmbedContentEdit.InputLabel')}</InputLabel>
        <p className="my-2 text-sm font-bold">
          {t('embeds:EmbedContentEdit.platforms')}
        </p>
        <MediaIconList usedMediaType={media?.type} />
        <div className="pt-4">
          <Input
            defaultValue={stepItem ? stepItem.content : ''}
            errors={errors.content}
            label="content"
            size={100}
            {...register('content')}
          />
        </div>
        <div className="re-data-media-preview pb-4 pt-4">
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
              <InputLabel>{t('embeds:EmbedContentEdit.autoplay')}</InputLabel>
            </div>
          )}
        </div>
        <Button isLoading={isSaving} type="submit">
          {stepItem && t('editModal:save')}
          {!stepItem && t('editModal:create')}
        </Button>
      </div>
    </form>
  )
}
