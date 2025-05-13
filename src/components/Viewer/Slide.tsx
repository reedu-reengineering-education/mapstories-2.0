'use client'

import { SlideContent, StoryStep } from '@prisma/client'
import * as React from 'react'
import { ContentType } from './ContentTypes/ContentTypes'

type Props = {
  step: (StoryStep & { content?: SlideContent[] }) | undefined
}

export function Slide({ step }: Props) {
  return (
    <div className="max-w-full overflow-x-hidden py-2">
      {step &&
        step.content &&
        step.content
          .sort((a, b) => a.position - b.position)
          .map((item, i) => {
            return <ContentType content={item} key={i}></ContentType>
          })}
    </div>
  )
}
