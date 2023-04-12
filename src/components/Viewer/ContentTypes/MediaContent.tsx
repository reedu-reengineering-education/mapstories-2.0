'use client'
import * as React from 'react'
import { Image, SlideContent } from '@prisma/client'
import { Spinner } from '../../Elements/Spinner'
import SizedImage from '../../Elements/SizedImage'
import useMedia from '@/src/lib/api/media/useMedia'
import { getS3Image } from '@/src/helper/getS3Image'

interface MediaContentProps extends React.HTMLAttributes<HTMLFormElement> {
  content: SlideContent
}

export function MediaContent({ content }: MediaContentProps) {
  const [imageUrl, setImageUrl] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [imageSize, setImageSize] = React.useState<string>('s')
  const { getMedia } = useMedia(content.storyStepId)

  React.useEffect(() => {
    const getImageWrapper = async () => {
      if (content.type === 'IMAGE' && imageUrl === null) {
        setIsLoading(true)
        // get image table from db
        const image = (await getMedia(content.imageId!)) as Image
        // get image file from s3
        const response = await getS3Image(image)
        setImageUrl(response)
        setIsLoading(false)
      }
      //const response = await getS3Image(im//await getImage2(stepItem)
    }
    getImageWrapper()
  }, [])

  return (
    <div className="py-2">
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && imageUrl && (
        <SizedImage
          alt={content.content}
          size={imageSize}
          src={imageUrl ? imageUrl : ''}
        />
      )}
    </div>
  )
}
