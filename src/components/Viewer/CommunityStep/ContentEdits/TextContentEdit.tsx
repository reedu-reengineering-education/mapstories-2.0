'use client'

import * as React from 'react'

import { Button } from '@/src/components/Elements/Button'
import { useState } from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'

interface TextContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  stepItem: any
  setItem?: any
  setContentType?: any
  setShowModal?: any
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

export function TextContentEdit({
  stepItem,
  setItem,
  setContentType,
  setShowModal,
}: TextContentEditProps) {
  const [textValue, setTextValue] = useState<string | undefined>(
    stepItem ? stepItem.content : '',
  )

  const handleSubmit = () => {
    // change the title of the slide
    setItem((prev: any) => {
      const updatedContent = prev.content.map((content: any) => {
        if (content.position === stepItem.position) {
          return {
            ...content,
            content: textValue,
          }
        }
        return content
      })
      return {
        ...prev,
        content: updatedContent,
      }
    })
    setContentType('addSlide')
    setShowModal(false)
  }

  return (
    <div className="top-0">
      <div className="pb-4 pt-4">
        <div>
          {/* @ts-ignore */}
          <MDEditor
            data-color-mode="light"
            onChange={setTextValue}
            preview="edit"
            value={textValue}
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button onClick={() => setContentType('addSlide')} variant={'inverse'}>
          Zurück
        </Button>
        <Button onClick={() => handleSubmit()}>Ändern</Button>
      </div>{' '}
    </div>
  )
}
