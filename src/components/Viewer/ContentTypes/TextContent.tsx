'use client'

import * as React from 'react'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { SlideContent } from '@prisma/client'

interface TextContentProps extends React.HTMLAttributes<HTMLFormElement> {
  content: SlideContent
}

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
          // className="hover:bg-hover"
          source={content.content}
          style={markdownPreviewStyles}
        />
      )}
    </div>
  )
}
