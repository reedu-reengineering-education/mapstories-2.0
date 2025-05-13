// @ts-nocheck
'use client'

import * as React from 'react'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { SlideContent } from '@prisma/client'

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>

interface PropsExtra {
  content: SlideContent
}
interface TextContentProps
  extends SimpleSpread<React.HTMLAttributes<HTMLFormElement>, PropsExtra> {}

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
})

const markdownPreviewStyles = {
  background: 'white',
  fontFamily: 'inherit',
}

export function TextContent({ content }: TextContentProps) {
  return (
    <div className="py-2">
      {content.content && (
        <MarkdownPreview
          source={content.content}
          style={markdownPreviewStyles}
        />
      )}
    </div>
  )
}
