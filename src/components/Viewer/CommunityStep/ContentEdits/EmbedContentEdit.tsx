'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/src/components/Elements/Button'
import { slideEmbedContentSchema } from '@/src/lib/validations/slidecontent'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { media_type } from '@/src/lib/media/media'
import { generateRandomName } from '@/src/helper/generateRandomName'
import useMedia from '@/src/lib/api/media/useMedia'
import { Embed } from '@/src/components/embeds/Embed'
import { urlToMedia } from '@/src/helper/urlToMedia'
import MediaIconList from '@/src/components/Studio/Mapstories/MediaPlatformIcons'

interface EmbedContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  setStepSuggestion: any
  stepSuggestion: any
  setContentType?: any
}

type FormData = z.infer<typeof slideEmbedContentSchema>

export function EmbedContentEdit({
  setStepSuggestion,
  stepSuggestion,
  setContentType,
  ...props
}: EmbedContentEditProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(slideEmbedContentSchema),
  })

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [media, setMedia] = useState<media_type | undefined>(stepSuggestion)
  const [optionState, setOptionState] = useState(stepSuggestion?.options)
  const [fileSource, setFileSource] = useState<string | undefined>(undefined)
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined)

  const { addMedia } = useMedia()

  const { content: url } = watch()
  useEffect(() => {
    handleUrl(url)
  }, [url])

  const { options: options } = watch()
  useEffect(() => {
    setOptionState(options)
    if (options && media && stepSuggestion) {
      stepSuggestion.options = options
    }
  }, [options?.autoplay])

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true)

      const newStepSuggestion = { ...stepSuggestion }
      const baseContent = {
        type: media?.type,
        position: stepSuggestion.content.length,
        suggestionId: null,
      }
      if (media?.type === 'EXTERNALIMAGE') {
        const uploadedMedia = await addMedia({
          name: generateRandomName(),
          url: media?.content,
          source: fileSource,
          size: 's',
        })
        newStepSuggestion.content.push({
          ...baseContent,
          content: uploadedMedia.name,
          mediaId: uploadedMedia.id,
        })
      } else {
        newStepSuggestion.content.push({
          ...baseContent,
          content: mediaUrl,
          options: optionState,
        })
      }

      setStepSuggestion(newStepSuggestion)
    } catch (error) {
      // Handle error if necessary
    } finally {
      setIsSaving(false)
      setContentType && setContentType('addSlide')
    }
  }

  async function handleUrl(url: string) {
    const new_media = urlToMedia(url)
    setMedia(new_media)
    if (new_media && url && stepSuggestion) {
      if (stepSuggestion) {
        setMediaUrl(url)
      }
    }
    if (new_media?.type == 'YOUTUBE' && !optionState) {
      setOptionState({ autoplay: false })
    } else if (new_media && new_media.type != 'YOUTUBE' && optionState) {
      setOptionState(null)
    }
    if (new_media?.type == 'EXTERNALIMAGE') {
      setFileSource(url.split('/')[0] + '//' + url.split('/')[2])
    }
  }

  const handleFileSource = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setFileSource(target.value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <div className="top-0 flex flex-col gap-4">
        <div className="w-full">
          <InputLabel>des</InputLabel>
          <p className="text-sm font-bold">Platformen</p>
          <MediaIconList usedMediaType={media?.type} />
          <div>
            <Input
              defaultValue={mediaUrl ?? ''}
              errors={errors.content}
              label="content"
              size={100}
              {...register('content')}
            />
          </div>
        </div>

        <div className="re-data-media-preview max-h-[20rem] overflow-y-auto">
          <Embed
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
        {/* input field to give a source */}
        <div className="flex items-center gap-2">
          <Input
            className="bg-slate-50"
            label="Quelle"
            onChange={e => handleFileSource(e)}
            value={fileSource}
          />
        </div>
        <div className="flex justify-between">
          <Button
            onClick={() => setContentType('addSlide')}
            variant={'inverse'}
          >
            Zurück
          </Button>
          <Button disabled={isSaving} isLoading={isSaving} type="submit">
            Speichern
          </Button>
        </div>
      </div>
    </form>
  )
}
