'use client'
import * as React from 'react'
import { SlideContent } from '@prisma/client'
import { retrievePresignedUrl } from '@/src/helper/retrievePresignedUrl'
import { Spinner } from '../../Elements/Spinner'
import SizedImage from '../../Elements/SizedImage'
import useMedia from '@/src/lib/api/media/useMedia'

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
      await getImage2(content)
    }
    getImageWrapper()
  }, [])

  async function getImage2(stepItem: SlideContent) {
    setIsLoading(true)
    const fileName = stepItem.imageId + '_' + stepItem.content
    const imageEntry = await getMedia(stepItem.imageId as string)
    // filter array and return only image with the same imageid
    let image = imageEntry!.content.filter(
      image => image.id === stepItem.imageId,
    ) as any
    image = image as Image[] // type assertion
    setImageSize(image[0].size)
    const preSignedUrl = await retrievePresignedUrl('GET', fileName)
    const response = await fetch(preSignedUrl, { method: 'GET' })
    const blob = await response.blob()
    const src = URL.createObjectURL(blob)
    setImageUrl(src)
    setIsLoading(false)
  }

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
