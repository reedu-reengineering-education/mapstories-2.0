'use client'

import * as React from 'react'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { useState } from 'react'
import { Embed } from '@/src/components/embeds/Embed'
import { urlToMedia } from '@/src/helper/urlToMedia'
import MediaIconList from '@/src/components/Studio/Mapstories/MediaPlatformIcons'

interface EmbedContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  setSource: (source: string) => void
  setMediaUrl: (url: string) => void
}

export function EmbedContent({
  setSource,
  setMediaUrl,
}: EmbedContentEditProps) {
  const [media, setMedia] = useState<any>()
  const [optionState, setOptionState] = useState({ autoplay: false })
  const [fileSource, setFileSource] = useState<string>('')
  const [embedUrl, setUrl] = useState<string>('')

  React.useEffect(() => {
    setSource(fileSource)
  }, [fileSource])

  React.useEffect(() => {
    setMediaUrl(embedUrl)
  }, [embedUrl])

  const handleUrl = async (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement
    const new_media = urlToMedia(target.value)
    setMedia(new_media)
    setUrl(target.value)

    if (new_media?.type == 'YOUTUBE' && !optionState) {
      setOptionState({ autoplay: false })
    } else if (new_media && new_media.type != 'YOUTUBE' && optionState) {
    }
    if (new_media?.type == 'EXTERNALIMAGE') {
      setFileSource(
        target.value.split('/')[0] + '//' + target.value.split('/')[2],
      )
    }
  }

  const handleFileSource = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setFileSource(target.value)
  }

  return (
    <div className="top-0 flex flex-col gap-4">
      <div className="flex w-full flex-col gap-4">
        <p className="text-sm font-bold">Platformen</p>
        <MediaIconList usedMediaType={media?.type} />
        <div>
          <Input label="content" onChange={e => handleUrl(e)} size={100} />
        </div>
      </div>

      <div className="re-data-media-preview max-h-[20rem] overflow-y-auto">
        <Embed media={media} options={optionState ? optionState : undefined} />
        {media &&
          media?.type == 'YOUTUBE' &&
          optionState?.autoplay != undefined && (
            <div className="flex items-center">
              <Input
                defaultChecked={optionState.autoplay}
                label="autoplay"
                onChange={e => setOptionState({ autoplay: e.target.checked })}
                type="checkbox"
              />
              <InputLabel>Autoplay</InputLabel>
            </div>
          )}
      </div>
      {/* input field to give a source */}
      <div className="flex items-center gap-2">
        <InputLabel>Quelle </InputLabel>
        <Input
          className="bg-slate-50"
          onChange={e => handleFileSource(e)}
          value={fileSource}
        />
      </div>
    </div>
  )
}
