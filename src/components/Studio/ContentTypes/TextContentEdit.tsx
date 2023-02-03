'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

import { Button } from '@/src/components/Elements/Button'
import { cx } from 'class-variance-authority'
import { slideTitleContentSchema } from '@/src/lib/validations/slidecontent'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';

interface TextContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
}



type FormData = z.infer<typeof slideTitleContentSchema>


const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
    ssr: false,
    });

export function TextContentEdit({
  storyStepId,
  className,
  ...props
}: TextContentEditProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(slideTitleContentSchema),
  })
  const [isSaving, setIsSaving] = useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    console.log(data);
    // const response = await fetch(`/api/mapstory/step/${storyStepId}/content`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ...data
    //   }),
    // })

    setIsSaving(false)

    // if (!response?.ok) {
    //   return toast({
    //     title: 'Something went wrong.',
    //     message: 'Your content was not created. Please try again',
    //     type: 'error',
    //   })
    // }

    // toast({
    //   message: 'Your content has been created.',
    //   type: 'success',
    // })

    // const newContent = (await response.json()) as SlideContent
    // router.refresh()
    // router.push(`/studio/${newStory.id}`)

  }

  const handleChange = (value) => {
    console.log(value);
    }

  const [value, setValue] = useState('**Hello world!!!**')

  return (
        <form
      className={cx(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="top-0">
        <div className="pt-4">
      <MDEditor onChange={handleChange} value={value} />
              </div>
        <Button disabled={isSaving} isLoading={isSaving} type="submit">
          Erstellen
        </Button>
      </div>
    </form>
  )
}
