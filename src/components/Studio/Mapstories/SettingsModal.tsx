'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { toast } from '@/src/lib/toast'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Input, InputLabel } from '../../Elements/Input'
import { mapstoryOptionsSchema } from '@/src/lib/validations/mapstory-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/src/app/i18n/client'
import { Textarea, TextareaLabel } from '@/src/components/Elements/Textarea'
import useStory from '@/src/lib/api/story/useStory'
import { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu'
import { useBoundStore } from '@/src/lib/store/store'
// import { useUIStore } from '@/src/lib/store/ui'
// import { useS3Upload } from "next-s3-upload";

type FormData = z.infer<typeof mapstoryOptionsSchema>

const options: Pick<DropdownMenuItemProps, 'children'>[] = [
  { children: 'Theme 1' },
  { children: 'Theme 2' },
  { children: 'Theme 3' },
  { children: 'Theme 4' },
  { children: 'Theme 5' },
]

export default function SettingsModal({ storyId }: { storyId: string }) {
  const router = useRouter()
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'settingsModal')
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
    resolver: zodResolver(mapstoryOptionsSchema),
  })

  const { story, updateStory } = useStory(storyId)

  // let { uploadToS3 } = useS3Upload();

  function handleImageUpload(event: any) {
    const file = event.target.files[0]
    // let { url } = await uploadToS3(file);

    // console.log("Successfully uploaded to S3!", url);
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    try {
      const updatedStory = await updateStory({
        ...data,
        visibility: data.public ? 'PUBLIC' : 'PRIVATE',
      })
      toast({
        message: 'Your changes were applied.',
        type: 'success',
      })
      // TODO: if the slug changes, we need to redirect / replace the route
      // router.push(`/studio/${updatedStory.slug}`)
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your changes were not applied. Please try again',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // show loading state
  if (!story) {
    return (
      <Button
        disabled
        startIcon={<Cog6ToothIcon className="w-5" />}
        variant={'inverse'}
      >
        {t('options')}
      </Button>
    )
  }

  return (
    <Modal
      title={<span>{t('options')}</span>}
      trigger={
        <Button
          startIcon={<Cog6ToothIcon className="w-5" />}
          variant={'inverse'}
        >
          {t('options')}
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content>
          <InputLabel>{t('name')}</InputLabel>
          <Input
            defaultValue={story.name || ''}
            errors={errors.name}
            label={t('name')}
            size={32}
            {...register('name')}
          />
          <TextareaLabel>{t('description')}</TextareaLabel>
          <Textarea
            cols={60}
            defaultValue={story.description || ''}
            errors={errors.description}
            label={t('description')}
            rows={5}
            {...register('description')}
          ></Textarea>

          {/* <Controller
            control={control}
            defaultValue={story.visibility === 'PUBLIC'}
            name="public"
            render={({ field: { onChange, value, ref } }) => {
              return (
                <div className="jusify-center flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    {t('private')}
                  </span>
                  <Switch
                    defaultChecked={value}
                    onCheckedChange={onChange}
                    ref={ref}
                  ></Switch>

                  <span className="text-sm font-medium text-gray-700">
                    {t('public')}
                  </span>
                </div>
              )
            }}
          />
          <Spacer />
          <select {...register('theme')}>
            {options.map((option, index) => (
              <option
                key={index}
                {...option}
                onSelect={() => {
                  setSelectedTheme(option.children as string)
                  setValue('theme', option.children as string)
                }}
              />
            ))}
          </select> */}
          {/* <DropdownMenu {...register('theme')}>
            <DropdownMenu.Trigger className="focus:ring-brand-900 flex items-center gap-2 overflow-hidden focus:ring-2 focus:ring-offset-2 focus-visible:outline-none">
              <span className="mb-2 flex text-sm font-medium text-gray-700">
                {t('theme')} <ChevronDownIcon className="mt-[0.15em] h-2 w-4" />
              </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                className="absolute z-50 md:w-[240px]"
              >
                {options.map((option, index) => (
                  <DropdownMenu.Item
                    key={index}
                    {...option}
                    onSelect={() => {
                      setSelectedTheme(option.children as string)
                      setValue('theme', option.children as string)
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
        <Modal.Footer
          close={
            <Button
              className="w-full"
              disabled={isSaving}
              isLoading={isSaving}
              type="submit"
              variant={'inverse'}
            >
              {t('save')}
            </Button>
          }
        ></Modal.Footer>
      </form>
    </Modal>
  )
}
