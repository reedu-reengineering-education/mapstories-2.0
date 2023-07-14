'use client'

import { SlideContent, StoryStep } from '@prisma/client'
import * as React from 'react'
import { ContentType } from './ContentTypes/ContentTypes'

type Props = {
  step: (StoryStep & { content?: SlideContent[] }) | undefined
}

export function Slide({ step }: Props) {
  return (
    <>
      <div className="py-4">
        {step &&
          step.content &&
          step.content
            .sort((a, b) => a.position - b.position)
            .map(item => {
              return <ContentType content={item} key={item.id}></ContentType>
            })}
      </div>
    </>
  )
}
