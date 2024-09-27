'use client'

import * as React from 'react'

import { Button } from '@/src/components/Elements/Button'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { useState } from 'react'

interface TitleContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  stepItem: any
  setItem?: any
  setContentType?: any
  setShowModal?: any
}

export function TitleContentEdit({
  stepItem,
  setItem,
  setContentType,
  setShowModal,
}: TitleContentEditProps) {
  const [inputValue, setInputValue] = useState<string>(
    stepItem ? stepItem.content : '',
  )

  const handleSubmit = async () => {
    // change the title of the slide
    setItem((prev: any) => {
      const updatedContent = prev.content.map((content: any) => {
        if (content.type === 'TITLE') {
          return {
            ...content,
            content: inputValue,
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
      <div className="pt-4">
        <InputLabel>Überschrift</InputLabel>
        <Input
          label="title"
          onChange={e => setInputValue(e.target.value)}
          size={100}
          value={inputValue}
        />
      </div>
      <div className="flex justify-between">
        <Button onClick={() => setContentType('addSlide')} variant={'inverse'}>
          Zurück
        </Button>
        <Button onClick={() => handleSubmit()}>Ändern</Button>
      </div>
    </div>
  )
}
