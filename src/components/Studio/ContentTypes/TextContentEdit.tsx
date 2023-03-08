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
import { useUIStore } from '@/src/lib/store/ui'

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
  let lng = useUIStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const router = useRouter()
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const { t } = useTranslation(lng, 'editModal')

  async function onSubmit(text: String) {
    try {
      setIsSaving(true)
      const url = `/api/mapstory/step/${
        stepItem ? stepItem.storyStepId : storyStepId
      }/content`
      const method = stepItem ? 'PUT' : 'POST'
      const headers = {
        'Content-Type': 'application/json',
      }
      const body = stepItem
        ? JSON.stringify({ ...stepItem, text: text })
        : JSON.stringify({ text: text })
      const response = await fetch(url, { method, headers, body })

      setIsSaving(false)

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      const newContent = await response.json()
      setIsSaving(false)
      toast({ message: 'Your content has been created.', type: 'success' })
      router.refresh()
      // router.push(`/studio/${newStory.id}`)
    } catch (error: any) {
      setIsSaving(false)
      toast({
        title: 'Error',
        message: error.message,
        type: 'error',
      })
    }
  }

  let textInEditor = 'Your text here'
  stepItem ? (textInEditor = stepItem.text) : ''

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
