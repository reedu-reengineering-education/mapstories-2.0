'use client'

import { getS3Image } from '@/src/helper/getS3Image'
import useMedia from '@/src/lib/api/media/useMedia'
import { useEffect, useState } from 'react'
import SizedImage from '../Elements/SizedImage'
import { Media } from '@prisma/client'
import logoNoText from '@/assets/logos/logo_no_text.png'
import Image from 'next/image'
type Props = {
  story: any
  firstStepId: string
  mediaId: string
}

export function ViewerPopup({ story, firstStepId, mediaId }: Props) {
  const { getMedia } = useMedia()
  const [mediaUrl, setMediaUrl] = useState<any>(null)

  useEffect(() => {
    const getMediaWrapper = async () => {
      for (let i = 0; i < story.firstStep.content.length; i++) {
        const contentLoop = story.firstStep.content[i]
        if (contentLoop.type === 'IMAGE') {
          const media = (await getMedia(contentLoop.mediaId)) as Media
          const response = await getS3Image(media)
          setMediaUrl(response)
          break
        }
      }
    }
    getMediaWrapper()
  }, [])

  return (
    <div className="flex flex-row items-center rounded-md border-2 border-slate-300 p-1 shadow">
      {mediaUrl && (
        <SizedImage alt={'popup'} size={'xs'} src={mediaUrl} variant="round" />
      )}
      {!mediaUrl && (
        <Image
          alt="Mapstories Logo"
          className="h-10 w-10 p-0.5"
          src={logoNoText}
        />
      )}
      <div className="py-2 text-center text-xs font-extrabold">
        {story.name}
      </div>
    </div>
  )
}
