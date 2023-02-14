'use client'

import * as React from 'react'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

import { Button } from '@/src/components/Elements/Button'
import { slideTitleContentSchema } from '@/src/lib/validations/slidecontent'
import { useState } from 'react'
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { toast } from '@/src/lib/toast'

interface TextContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
}



type FormData = z.infer<typeof slideTitleContentSchema>


const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

export function TextContentEdit({
  storyStepId,
}: TextContentEditProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const handleClick = async (value: string) => {
    setIsSaving(true);
    const response = await fetch(`/api/mapstory/step/${storyStepId}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: value
      }),
    })

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your content was not created. Please try again',
        type: 'error',
      })
    }

    toast({
      message: 'Your content has been created.',
      type: 'success',
    })

    router.refresh()

  }

  const [value, setValue] = useState('Your text here')

  return (
    <div className="top-0">
      <div className="pt-4">
        <MDEditor onChange={setValue} preview="edit" value={value} />
      </div>
      <Button disabled={isSaving} isLoading={isSaving} onClick={() => handleClick(value)} type="submit">
        Erstellen
      </Button>
    </div>
  )
}
