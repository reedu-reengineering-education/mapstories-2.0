'use client'

import { createMapstoryeSchema } from '@/src/lib/validations/mapstory'
import { useState } from 'react'
import { Modal } from '@/src/components/Modal'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon, HeadingIcon, TextIcon, TwitterLogoIcon, VideoIcon } from '@radix-ui/react-icons';
import React from 'react'
import { CSSTransition } from 'react-transition-group';
import { TitleContentEdit } from '@/src/components/Studio/ContentTypes/TitleContentEdit'
type FormData = z.infer<typeof createMapstoryeSchema>

type Props = {
  trigger: React.ReactElement
  storyStepId: string
}

export default function SlideContentModal({ trigger, storyStepId }: Props) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createMapstoryeSchema),
  })
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [contentType, setContentType] = useState<string>('')


  const [container, setContainer] = React.useState(null);
  async function onSubmit(data: FormData) {
    // setIsSaving(true)

    // const response = await fetch('/api/mapstory', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name: data.name,
    //   }),
    // })

    // setIsSaving(false)

    // if (!response?.ok) {
    //   return toast({
    //     title: 'Something went wrong.',
    //     message: 'Your mapstory was not created. Please try again',
    //     type: 'error',
    //   })
    // }

    // toast({
    //   message: 'Your mapstory has been created.',
    //   type: 'success',
    // })

    // const newStory = (await response.json()) as Story
    // router.refresh()
    // router.push(`/studio/${newStory.id}`)
  }

  return (
    <>
      <Modal title={''} trigger={trigger}>

        <Modal.Content>
          <div className="relative">
            <CSSTransition
              appear
              classNames="slide-transition"
              in={contentType === ''}
              timeout={400}
              unmountOnExit>
              <div>
                <p className="pb-2">Wähle aus was für ein Element du deiner Folie hinzufügen möchtest:</p>

                <div className="flex flex-wrap justify-center py-4">
                  <div className='w-36 re-basic-box-no-shadow px-4 py-2 m-3 cursor-pointer re-hover-element' onClick={() => setContentType('title')}>
                    <div className="flex justify-center">
                      <HeadingIcon className='w-14 h-14'></HeadingIcon>
                    </div>
                    <h3 className="text-center">Heading</h3>
                  </div>

                  <div className='w-36 re-basic-box-no-shadow px-4 py-2 m-3 cursor-pointer re-hover-element'>
                    <div className="flex justify-center">
                      <TextIcon className='w-14 h-14'></TextIcon>
                    </div>
                    <h3 className="text-center">Text</h3>
                  </div>

                  <div className='w-36 re-basic-box-no-shadow px-4 py-2 m-3 cursor-pointer re-hover-element'>
                    <div className="flex justify-center">
                      <VideoIcon className='w-14 h-14'></VideoIcon>
                    </div>
                    <h3 className="text-center">Video/Bild</h3>
                  </div>

                  <div className='w-36 re-basic-box-no-shadow px-4 py-2 m-3 cursor-pointer re-hover-element'>
                    <div className="flex justify-center">
                      <TwitterLogoIcon className='w-14 h-14'></TwitterLogoIcon>
                    </div>
                    <h3 className="text-center">Embed</h3>
                  </div>
                </div>
              </div>
            </CSSTransition>

            {/* <Select.Root onValueChange={e => setContentType(e)}><Select.Trigger aria-label="ContentType" className="SelectTrigger">
            <Select.Value placeholder="Wähle ein Element" />
            <Select.Icon className="SelectIcon">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="SelectContent relative z-50">
              <Select.ScrollUpButton className="SelectScrollButton">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="SelectViewport">
                <Select.Group>
                  <Select.Label className="SelectLabel">Element:</Select.Label>
                  <SelectItem value="title">Überschrift</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="media">Video/Bild</SelectItem>
                  <SelectItem value="embed">Embed</SelectItem>
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton className="SelectScrollButton">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
*/}
            {
              contentType == 'title' && (
                <>
                  <CSSTransition
                    appear
                    classNames="slide-transition-reverse"
                    in={contentType != ''}
                    timeout={400}
                    unmountOnExit>
                    <div className="top-0">
                      <div className="absolute -top-6 ">
                        <button className="flex" onClick={() => setContentType('')}><ArrowLeftIcon className="h-6 w-6 mr-2"></ArrowLeftIcon> Zurück</button>
                      </div>
                      <TitleContentEdit storyStepId={storyStepId}></TitleContentEdit>
                      {/* <div className="top-0">
                      <div className="absolute -top-6 ">
                        <button className="flex" onClick={() => setContentType('')}><BackspaceIcon className="h-6 w-6 mr-2"></BackspaceIcon> Zurück</button>
                      </div>
                      <div className="pt-4">
                        <InputLabel>Gib eine Überschrift für deine Folie ein</InputLabel>
                        <Input
                          errors={errors.title}
                          label="title"
                          size={32}
                          {...register('title')}
                        />
                      </div>
                      <Button disabled={isSaving} isLoading={isSaving} type="submit">
                        Erstellen
                      </Button>
                    </div> */}
                    </div>
                  </CSSTransition>
                </>
              )
            }
          </div>
        </Modal.Content >
        {/* <Modal.Footer>
      
        </Modal.Footer> */}
      </Modal >
    </>
  )
}

// //@ts-ignore
// const SelectItem = React.forwardRef<React.ElementRef<typeof Select.Item>>(({ className, children, ...props }, forwardedRef) => {
//   return (
//     //@ts-ignore
//     <Select.Item className={cx('SelectItem', className)} {...props} ref={forwardedRef}>
//       <Select.ItemText>{children}</Select.ItemText>
//       <Select.ItemIndicator className="SelectItemIndicator">
//         <CheckIcon />
//       </Select.ItemIndicator>
//     </Select.Item>
//   );
// });
