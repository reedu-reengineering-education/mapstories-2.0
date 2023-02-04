'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline/'
import { toast } from '@/src/lib/toast'
// import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Input, InputLabel } from '../../../src/components/Elements/Input'
import { DropdownMenu } from '@/src/components/Dropdown'
import * as Switch from '@radix-ui/react-switch'

export default function SettingsModal() {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [publicSwitch, setPublicSwitch] = useState<boolean>(true)
  const [image, setImage] = useState<string | undefined>()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({})

  function handleImageUpload(event: any) {
    setImage(event.target.value)
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    try {
      //   const response = await createStory({ name: data.name })
      toast({
        message: 'Deine Änderungen wurden übernommen',
        type: 'success',
      })
      //   const newStory = await response.data
      //   router.refresh()
      //   router.push(`/studio/${newStory.id}`)
    } catch (e) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your mapstory was not created. Please try again',
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
                //   errors={errors.}
                label="Name"
                size={32}
                //   {...register('name')}
              />
              <InputLabel>Beschreibung</InputLabel>
              <Input label="Beschreibung" size={240}></Input>
              <div className="flex items-center">
                <label className="pr-8" htmlFor="publicSwitch">
                  Public
                </label>
                <Switch.Root className=" relative inline-flex h-5  w-6 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-purple-600 opacity-50 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-purple-500">
                  <Switch.Thumb className="pointer-events-none inline-block h-5 w-6 transform rounded-full bg-purple-600 shadow-lg ring-0 transition duration-200 ease-in-out" />
                </Switch.Root>
              </div>
              <DropdownMenu>
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
                    <DropdownMenu.Item>Theme1</DropdownMenu.Item>
                    <DropdownMenu.Item>Theme2</DropdownMenu.Item>
                    <DropdownMenu.Item>Theme3</DropdownMenu.Item>
                    <DropdownMenu.Item>Theme 4</DropdownMenu.Item>
                    <DropdownMenu.Item>Theme 5</DropdownMenu.Item>
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
                  id="imageupload"
                  onChange={handleImageUpload}
                  type="file"
                ></Input>
                <Input
                  label="Bild"
                  placeholder="Wähle ein Bild aus oder gib eine URL ein"
                  size={100}
                  value={image}
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
