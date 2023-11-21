'use client'

import { getS3Image } from '@/src/helper/getS3Image'
import useMedia from '@/src/lib/api/media/useMedia'
import { useEffect, useState } from 'react'
import SizedImage from '../Elements/SizedImage'
import { Media } from '@prisma/client'

type Props = {
  story: any
  firstStepId: string
  mediaId: string
}

export function ViewerPopup({ story, firstStepId, mediaId }: Props) {
  const { getMedia } = useMedia(firstStepId)
  const [mediaUrl, setMediaUrl] = useState<any>(null)

  useEffect(() => {
    const getMediaWrapper = async () => {
      const media = (await getMedia(mediaId)) as Media
      const response = await getS3Image(media)
      setMediaUrl(response)
    }
    getMediaWrapper()
  }, [])

  return (
    <div className="flex flex-row items-center p-0.5">
      <SizedImage
        alt={'popup'}
        size={'xs'}
        src={mediaUrl ? mediaUrl : ''}
        variant="round"
      />
      <div className="text-center   text-xs font-extrabold ">
        {'How to Mapstory: Auf dem Weg zu mehr Nachhaltigkeit  '}
      </div>
    </div>
  )
}
