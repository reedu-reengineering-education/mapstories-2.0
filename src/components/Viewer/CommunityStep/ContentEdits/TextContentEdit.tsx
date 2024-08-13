'use client'

import * as React from 'react'

import { Button } from '@/src/components/Elements/Button'
import { useState } from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { toast } from '@/src/lib/toast'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'

interface TextContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  stepSuggestion: any
  stepItem?: any
  setContentType?: any
  setShowModal?: any
  setStepSuggestion: any
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

export function TextContentEdit({
  stepSuggestion,
  stepItem,
  setContentType,
  setShowModal,
  setStepSuggestion
}: TextContentEditProps) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const [isSaving, setIsSaving] = useState<boolean>(false)


  const [textValue, setTextValue] = useState<string | undefined>(
    'Placeholder',
  )

  React.useEffect(() => {
    if (stepItem) {
      setTextValue(stepItem.content)
    }
  }, [])

  async function onSubmit(text: string) {
    try {
      const newStepSuggestion = stepSuggestion
      newStepSuggestion.content.push({
        type: 'TEXT',
        content: text,
        position: stepSuggestion.content[stepSuggestion.content.length - 1].position + 1,
        suggestionId: null,
      })
      setStepSuggestion(newStepSuggestion)




      // if (stepItem) {
      //   await updateContent(stepItem.id, {
      //     ...stepItem,
      //     content: text,
      //     type: 'TEXT',
      //   })
      //   toast({
      //     message: 'contentUpdated',
      //     type: 'success',
      //   })
      // } else {
      //   await addContent({ content: text, type: 'TEXT' })
      //   toast({
      //     message: 'contentCreated',
      //     type: 'success',
      //   })
      // }
    } catch (error) {
      console.log(error);
      toast({
        title: 'somethingWrong',
        message: 'contentNotCreated',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
    if (setShowModal) {
      setShowModal(false)
    }
  }

  function handleOnClick() {
    if (textValue === 'Placeholder') {
      setTextValue('')
    }
  }

  return (
    <div className="top-0">
      <div className="pb-4 pt-4">
        <div onClick={handleOnClick}>
          {/* @ts-ignore */}
          <MDEditor
            data-color-mode="light"
            onChange={setTextValue}
            preview="edit"
            value={textValue}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          disabled={isSaving}
          isLoading={isSaving}
          onClick={() => {
            if (textValue != undefined) {
              onSubmit(textValue)
            }
            setContentType ? setContentType('addSlide') : null
          }}
          type="submit"
        >
          {stepItem && 'save'}
          {!stepItem && 'create'}
        </Button>
      </div>{' '}
    </div>
  )
}
