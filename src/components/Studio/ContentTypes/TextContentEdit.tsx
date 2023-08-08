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
  setShowModal?: any
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

export function TextContentEdit({
  storyStepId,
  stepItem,
  setContentType,
  setShowModal,
}: TextContentEditProps) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const router = useRouter()
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const { t } = useTranslation(lng, 'editModal')

  const [textValue, setTextValue] = useState<string | undefined>(
    t('placeholderTextInput'),
  )
  const { addContent, updateContent } = useStep(storyStepId)

  React.useEffect(() => {
    if (stepItem) {
      setTextValue(stepItem.content)
    }
  }, [])

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
          message: t('contentUpdated'),
          type: 'success',
        })
      } else {
        await addContent({ content: text, type: 'TEXT' })
        toast({
          message: t('contentCreated'),
          type: 'success',
        })
      }
    } catch (error) {
      toast({
        title: t('somethingWrong'),
        message: t('contentNotCreated'),
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
    if (setShowModal) {
      setShowModal(false)
    }
    setContentType && setContentType('')
  }

  function handleOnClick() {
    if (textValue === t('placeholderTextInput')) {
      setTextValue('')
    }
  }

  return (
    <div className="top-0">
      <div className="pb-4 pt-4">
        <div onClick={handleOnClick}>
          {t('textEditor')}

          <MDEditor
            data-color-mode="light"
            onChange={setTextValue}
            preview="edit"
            value={textValue}
          />
        </div>
      </div>
      <Button
        disabled={isSaving}
        isLoading={isSaving}
        onClick={() => {
          if (textValue != undefined) {
            onSubmit(textValue)
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
