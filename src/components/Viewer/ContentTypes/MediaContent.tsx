'use client'
import * as React from 'react'
import { Media, SlideContent } from '@prisma/client'
import { Spinner } from '../../Elements/Spinner'
import SizedImage from '../../Elements/SizedImage'
import useMedia from '@/src/lib/api/media/useMedia'
import { getS3Image } from '@/src/helper/getS3Image'
import ReactPlayer from 'react-player'

interface MediaContentProps extends React.HTMLAttributes<HTMLFormElement> {
  content: SlideContent
}

export function MediaContent({ content }: MediaContentProps) {
  const [mediaUrl, setMediaUrl] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [imageSize, setImageSize] = React.useState<string>('s')
  const { getMedia } = useMedia(content.storyStepId)
  React.useEffect(() => {
    const getMediaWrapper = async () => {
      if (
        (content.type === 'IMAGE' ||
          content.type === 'AUDIO' ||
          content.type === 'VIDEO') &&
        mediaUrl === null
      ) {
        setIsLoading(true)
        // get media table from db
        const media = (await getMedia(content.mediaId!)) as Media
        // get media file from s3
        const response = await getS3Image(media)
        setMediaUrl(response)
        setIsLoading(false)
      }
      if (content.type === 'EXTERNALIMAGE' && mediaUrl === null) {
        const media = (await getMedia(content.mediaId!)) as Media
        setMediaUrl(media.url)
      }
      //const response = await getS3Image(im//await getImage2(stepItem)
    }
    getMediaWrapper()
  }, [])

  return (
    <div className="py-2">
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading &&
        (content.type === 'IMAGE' || content.type === 'EXTERNALIMAGE') && (
          <SizedImage
            alt={content.content}
            size={imageSize}
            src={mediaUrl ? mediaUrl : ''}
          />
        )}
      {!isLoading && content.type === 'VIDEO' && (
        <ReactPlayer
          controls={true}
          height="100%"
          url={mediaUrl}
          width="100%"
        />
      )}
      {!isLoading && content.type === 'AUDIO' && (
        <ReactPlayer
          controls={true}
          height="15rem"
          url={mediaUrl}
          width="100%"
        />
      )}
    </div>
  )
}
