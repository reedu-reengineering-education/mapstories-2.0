'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline/'
import { toast } from '@/src/lib/toast'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { Input, InputLabel } from '../../../src/components/Elements/Input'
import { mapstoryOptionsSchema } from '@/src/lib/validations/mapstory-options'
import * as Switch from '@radix-ui/react-switch'
import { DropdownMenu } from '@/src/components/Dropdown'
import { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { updateStory } from '@/src/lib/api/story/updateStory'

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
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [image, setImage] = useState<string | any>()
  const [selectedTheme, setSelectedTheme] = useState('')
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(mapstoryOptionsSchema),
  })

  function handleImageUpload(event: any) {
    setImage(event.target.files[0])
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    try {
      const response = await updateStory(storyId, {
        name: data.name,
        description: data.description,
        // public: data.public,
        //theme: data.theme,
        image: data.image,
      })
      toast({
        message: 'Your changes were applied.',
        type: 'success',
      })
      router.push(`/studio/${response.data.name}`)
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
  return (
    <Modal
      title={<span>Optionen</span>}
      trigger={
        <Button
          startIcon={<Cog6ToothIcon className="w-5" />}
          variant={'inverse'}
        >
          Optionen
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content>
          <div className="m-15 border-t-2 p-10">
            <div className="block">
              <InputLabel>Name</InputLabel>
              <Input
                errors={errors.name}
                label="Name"
                size={32}
                {...register('name')}
              />
              <InputLabel>Beschreibung</InputLabel>
              <Input
                errors={errors.description}
                label="Beschreibung"
                size={240}
                {...register('description')}
              ></Input>
              <Controller
                control={control}
                defaultValue={false}
                name="public"
                render={({ field: { onChange, value } }) => (
                  <div>
                    <span className="mb-2 mr-8 text-sm font-medium text-gray-700">
                      Private
                    </span>
                    <Switch.Root
                      className={'Switch'}
                      data-state={value ? 'checked' : 'unchecked'}
                      onClick={() => onChange(!value)}
                    >
                      <Switch.Thumb className="SwitchThumb" />
                    </Switch.Root>

                    <span className="mb-2 ml-8 text-sm font-medium text-gray-700">
                      Public
                    </span>
                  </div>
                )}
              />
              <DropdownMenu {...register('theme')}>
                <DropdownMenu.Trigger className="focus:ring-brand-900 flex items-center gap-2 overflow-hidden focus:ring-2 focus:ring-offset-2 focus-visible:outline-none">
                  <span className="mb-2 flex text-sm font-medium text-gray-700">
                    Themes <ChevronDownIcon className="mt-[0.15em] h-2 w-4" />
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
              </DropdownMenu>

              <InputLabel>Bild</InputLabel>
              <div className="flex">
                <label htmlFor="imageupload">
                  <div className="h-9 w-10 cursor-pointer rounded border border-slate-300 hover:border-slate-400">
                    <ChevronDownIcon className="mx-2 mt-2 h-4 w-4 stroke-2" />
                  </div>
                </label>
                <Input
                  accept="image/*"
                  className="hidden"
                  // errors={errors.image}
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
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Button
            className="w-full"
            isLoading={isSaving}
            type="submit"
            variant={'inverse'}
          >
            Übernehmen
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
