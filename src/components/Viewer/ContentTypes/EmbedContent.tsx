'use client'

import * as React from 'react'
import { SlideContent } from '@prisma/client'
import { Embed } from '../../embeds/Embed'
import { urlToMedia } from '@/src/helper/urlToMedia'

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>

interface PropsExtra {
  content: SlideContent
}
interface EmbedContentEditProps
  extends SimpleSpread<React.HTMLAttributes<HTMLFormElement>, PropsExtra> {}

export function EmbedContent({ content }: EmbedContentEditProps) {
  return (
    <div className="flex max-h-[24rem] w-full justify-center overflow-y-auto overflow-x-hidden  ">
      {content.content && (
        <Embed
          media={urlToMedia(content.content)}
          options={content.options as object}
        />
      )}
    </div>
  )
}
