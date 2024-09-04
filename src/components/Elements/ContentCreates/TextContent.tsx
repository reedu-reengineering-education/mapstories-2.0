'use client'

import * as React from 'react'

import { useState } from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'

interface TextContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  setValue: any
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

export function TextContent({ setValue }: TextContentEditProps) {
  const [textValue, setTextValue] = useState<string | undefined>('Placeholder')

  React.useEffect(() => {
    setValue(textValue)
  }, [])

  React.useEffect(() => {
    setValue(textValue)
  }, [textValue])

  const handleOnClick = () => {
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
    </div>
  )
}
