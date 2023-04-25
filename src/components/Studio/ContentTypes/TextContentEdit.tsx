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
import { useBoundStore } from '@/src/lib/store/store'
import useStep from '@/src/lib/api/step/useStep'

interface TextContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  stepItem?: any
  setContentType?: any
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

export function TextContentEdit({
  storyStepId,
  stepItem,
  setContentType,
}: TextContentEditProps) {
  let lng = useBoundStore(state => state.language)
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

  let textInEditor = 'Your text here...'
  stepItem ? (textInEditor = stepItem.content) : ''

  const [value, setValue] = useState<string | undefined>(textInEditor)
  return (
    <div className="top-0">
      <div className="pb-4 pt-4">
        <MDEditor
          data-color-mode="light"
          onChange={setValue}
          preview="edit"
          value={value}
        />
      </div>
      <Button
        disabled={isSaving}
        isLoading={isSaving}
        onClick={() => {
          if (value != undefined) {
            onSubmit(value)
          }
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
