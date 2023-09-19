'use client'

import * as React from 'react'
import { SlideContent } from '@prisma/client'

interface TitleContentProps extends React.HTMLAttributes<HTMLFormElement> {
  content: SlideContent
}

export function TitleContent({ content }: TitleContentProps) {
  return (
    <div>
      {content.content && (
        <h1 className="enable-theme-font">{content.content}</h1>
      )}
    </div>
  )
}
