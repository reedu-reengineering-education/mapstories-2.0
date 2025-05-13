'use client'

import * as React from 'react'
import { SlideContent } from '@prisma/client'

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>

interface PropsExtra {
  content: SlideContent
}
interface TitleContentProps
  extends SimpleSpread<React.HTMLAttributes<HTMLFormElement>, PropsExtra> {}

export function TitleContent({ content }: TitleContentProps) {
  return (
    <div>
      {content.content && (
        <h1 className="enable-theme-font">{content.content}</h1>
      )}
    </div>
  )
}
