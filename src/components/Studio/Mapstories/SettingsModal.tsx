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

// const themes: any[] = [
//   {
//     name: 'Standard',
//     shadow_color: 'rgba(56,56.58, 0.9)',
//     border: '3px solid #38383a',
//     box_shadow: '4px 4px 0px var(--shadow-color)',
//     border_radius: '10px',
//     text_color: '#38383a',
//   },
//   {
//     name: 'Funky',
//     shadow_color: 'rgba(237, 130, 222, 0.9)',
//     border: '3px solid rgb(237, 160, 222)',
//     box_shadow: '4px 4px 0px var(--shadow-color)',
//     border_radius: '2px',
//     text_color: '#BDCF3B',
//   },
// ]

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
  const { t } = useTranslation(lng, ['settingsModal', 'studio'])
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
        title={t('settingsModal:name')}
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
              Im Timeline-Modus kann zu jedem Schritt ein Zeitstempel
              gespeichert werden. Dadurch lassen sich historische Ereignisse
              noch besser visualisieren.
            </p>
            <Spacer size={'sm'} />
            {errors.mode && (
              <p className="px-1 text-xs text-red-600">{errors.mode.message}</p>
            )}
            <Controller
              control={control}
              defaultValue={StoryMode.NORMAL}
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
            <Controller
              control={control}
              defaultValue={story.themeId ?? themes[0].name}
              // name="theme"
              {...register('themeId')}
              render={({ field: { onChange, value, ref } }) => {
                return (
                  <Select
                    onValueChange={e => {
                      selectTheme(e)
                      onChange(e)
                    }}
                    value={value}
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
                )
              }}
            />
            {/* <DropdownMenu {...register('theme')}>
              <DropdownMenu.Trigger className="focus:ring-brand-900 flex items-center gap-2 overflow-hidden focus:ring-2 focus:ring-offset-2 focus-visible:outline-none">
                <span className="mb-2 flex text-sm font-medium text-gray-700">
                  Theme
                  <ChevronDownIcon className="mt-[0.15em] h-2 w-4" />
                </span>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  className="absolute z-50 md:w-[240px]"
                >
                  {themes.map((theme, index) => (
                    <DropdownMenu.Item
                      key={index}
                      {...option}
                      onSelect={() => {
                        setSelectedTheme(theme.name as string)
                        setValue('theme', theme.name as string)
                      }}
                    />
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu> */}
            {/* <Spacer />
          <InputLabel>{t('image')}</InputLabel>
          <div className="flex">
            <label htmlFor="imageupload">
              <div className="flex h-9 w-10 cursor-pointer items-center justify-center rounded border border-slate-300 hover:border-slate-400">
                <ChevronDownIcon className="h-4 w-4 stroke-2" />
              </div>
            </label>
            <Input
              accept="image/*"
              className="hidden"
              errors={errors.image}
              id="imageupload"
              onChange={e => handleImageUpload(e)}
              type="file"
              // {...register('image')}
            ></Input>
            <Input
              errors={errors.image}
              label="Bild"
              placeholder="Wähle ein Bild aus oder gib eine URL ein"
              size={100}
              value={image}
              {...register('image')}
            ></Input>
          </div> */}
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
