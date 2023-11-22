'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { toast } from '@/src/lib/toast'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { Input, InputLabel } from '../../Elements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/src/app/i18n/client'
import { Textarea, TextareaLabel } from '@/src/components/Elements/Textarea'
import useStory from '@/src/lib/api/story/useStory'
import { useBoundStore } from '@/src/lib/store/store'
import { updateMapstorySchema } from '@/src/lib/validations/mapstory'
import Switch from '../../Elements/Switch'
import { Spacer } from '../../Elements/Spacer'
import { StoryMode, Theme } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../Elements/Select'
import { applyTheme } from '@/src/helper/applyTheme'
// import { useUIStore } from '@/src/lib/store/ui'
// import { useS3Upload } from "next-s3-upload";

type FormData = z.infer<typeof updateMapstorySchema>

export default function SettingsModal({
  storyId,
  shadow,
  themes,
}: {
  storyId: string
  shadow?: boolean
  themes: Theme[]
}) {
  const router = useRouter()
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, ['settingsModal', 'studio', 'timeline'])

  const [isSaving, setIsSaving] = useState(false)
  const [image, setImage] = useState<string | any>()
  const [selectedTheme, setSelectedTheme] = useState('')

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateMapstorySchema),
  })

  const { story, updateStory } = useStory(storyId)

  const [modalOpen, setModalOpen] = useState(false)

  // let { uploadToS3 } = useS3Upload();

  function handleImageUpload(event: any) {
    const file = event.target.files[0]
    // let { url } = await uploadToS3(file);

    // console.log("Successfully uploaded to S3!", url);
  }

  function selectTheme(themeName: any) {
    const selectedTheme = themes.find(theme => theme.name == themeName)
    applyTheme(selectedTheme)
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    try {
      const updatedStory = await updateStory({
        ...data,
        // TODO: update again after zod schema change
        visibility: data.visibility === true ? 'PUBLIC' : 'PRIVATE',
      })
      toast({
        message: t('settingsModal:changesApplied'),
        type: 'success',
      })
      if (updatedStory?.slug !== story?.slug) {
        router.replace(`/storylab/${updatedStory?.slug}`)
      }
      setModalOpen(false)
    } catch (e) {
      console.log(e)
      return toast({
        title: t('studio:somethingWrong'),
        message: t('settingsModal:changesNotApplied'),
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!story) {
    return <></>
  }

  return (
    <>
      <Button
        className={shadow ? 're-basic-box' : ''}
        disabled={!story}
        onClick={() => setModalOpen(true)}
        startIcon={<Cog6ToothIcon className="w-5" />}
        variant={'inverse'}
      >
        {t('settingsModal:options')}
      </Button>
      <Modal
        onOpenChange={setModalOpen}
        open={modalOpen}
        title={t('settingsModal:modalHeader')}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content>
            <InputLabel>{t('settingsModal:name')}</InputLabel>
            <Input
              defaultValue={story.name || ''}
              errors={errors.name}
              label={t('settingsModal:name')}
              size={100}
              {...register('name')}
            />
            <InputLabel> {t('settingsModal:author')}</InputLabel>
            <Input
              defaultValue={story.author || ''}
              errors={errors.author}
              label={t('settingsModal:author')}
              size={100}
              {...register('author')}
            />
            <TextareaLabel>{t('settingsModal:description')}</TextareaLabel>
            <Textarea
              cols={60}
              defaultValue={story.description || ''}
              errors={errors.description}
              label={t('settingsModal:description')}
              rows={5}
              {...register('description')}
            ></Textarea>

            <Spacer />
            <InputLabel>Modus</InputLabel>
            <p className="rounded bg-zinc-100 p-2 text-xs text-zinc-700">
              {t('timeline:modeDescription')}
            </p>
            <Spacer size={'sm'} />
            {errors.mode && (
              <p className="px-1 text-xs text-red-600">{errors.mode.message}</p>
            )}
            <Controller
              control={control}
              defaultValue={story.mode ?? StoryMode.NORMAL}
              name="mode"
              render={({ field: { onChange, ref } }) => {
                return (
                  <div className="jusify-center flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      NORMAL
                    </span>
                    <Switch
                      defaultChecked={story.mode === StoryMode.TIMELINE}
                      onCheckedChange={checked =>
                        onChange(
                          checked ? StoryMode.TIMELINE : StoryMode.NORMAL,
                        )
                      }
                      ref={ref}
                    ></Switch>
                    <span className="text-sm font-medium text-gray-700">
                      TIMELINE
                    </span>
                  </div>
                )
              }}
            />
            <Spacer />
            <InputLabel>{t('settingsModal:visibility')}</InputLabel>
            <Controller
              control={control}
              defaultValue={false}
              name="visibility"
              // {...register('visibility')}
              render={({ field: { onChange, value, ref } }) => {
                return (
                  <div className="jusify-center flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      {t('settingsModal:private')}
                    </span>
                    <Switch
                      defaultChecked={story.visibility === 'PUBLIC'}
                      onCheckedChange={onChange}
                      ref={ref}
                    ></Switch>

                    <span className="text-sm font-medium text-gray-700">
                      {t('settingsModal:public')}
                    </span>
                  </div>
                )
              }}
            />
            <Spacer />
            <InputLabel>{t('settingsModal:theme')}</InputLabel>
            <Controller
              control={control}
              defaultValue={story.themeId ?? themes[0].name}
              // name="theme"
              {...register('themeId')}
              render={({ field: { onChange, value, ref } }) => {
                return (
                  <>
                    <Select
                      defaultValue={value}
                      onValueChange={e => {
                        selectTheme(e)
                        onChange(e)
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent ref={ref}>
                        {themes.map((theme: any) => (
                          <SelectItem key={theme.name} value={theme.name}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )
              }}
            />
            <Spacer />
            <Controller
              control={control}
              defaultValue={true}
              name="lines"
              // {...register('visibility')}
              render={({ field: { onChange, value, ref } }) => {
                return (
                  <div className="jusify-center flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      {t('settingsModal:nolines')}
                    </span>

                    <Switch
                      defaultChecked={story.lines}
                      onCheckedChange={onChange}
                      ref={ref}
                    ></Switch>
                    <span className="text-sm font-medium text-gray-700">
                      {t('settingsModal:lines')}
                    </span>
                  </div>
                )
              }}
            />
          </Modal.Content>
          <Modal.Footer>
            <Button
              className="w-full"
              disabled={isSaving}
              isLoading={isSaving}
              type="submit"
              variant={'inverse'}
            >
              {t('settingsModal:save')}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
