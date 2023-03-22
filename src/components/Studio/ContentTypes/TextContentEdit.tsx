'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/src/components/Elements/Button'
import { useState } from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import useStep from '@/src/lib/api/step/useStep'

interface TextContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  stepItem?: any
  lng: string
  setContentType?: any
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

export function TextContentEdit({
  storyStepId,
  stepItem,
  lng,
  setContentType,
}: TextContentEditProps) {
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const router = useRouter()
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const { t } = useTranslation(lng, 'editModal')

  const { addContent, updateContent } = useStep(storyStepId)

  async function onSubmit(text: string) {
    try {
      setIsSaving(true)
      if (stepItem) {
        await updateContent(stepItem.id, {
          ...stepItem,
          content: text,
          type: 'TEXT',
        })
        toast({
          message: 'Your content has been updated.',
          type: 'success',
        })
      } else {
        await addContent({ content: text, type: 'TEXT' })
        toast({
          message: 'Your content has been created.',
          type: 'success',
        })
      }

      router.refresh()
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        message: 'Your content was not created. Please try again.',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
    setContentType && setContentType('')
  }

  let textInEditor = 'Your text here'
  stepItem ? (textInEditor = stepItem.content) : ''

  const [value, setValue] = useState(textInEditor)
  return (
    <div className="top-0">
      <div className="pt-4 pb-4">
        {/*TODO: @ERIC fix ts error pls */}
        {/* @ts-ignore */}
        <MDEditor onChange={setValue} preview="edit" value={value} />
      </div>
      <Button
        disabled={isSaving}
        isLoading={isSaving}
        onClick={() => {
          onSubmit(value)
          setContentType ? setContentType('') : null
        }}
        type="submit"
      >
        {stepItem && t('save')}
        {!stepItem && t('create')}
      </Button>
    </div>
  )
}
