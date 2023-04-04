'use client'
import * as React from 'react'
import { SlideContent } from '@prisma/client'
import Image from 'next/image'
import { retrievePresignedUrl } from '@/src/helper/retrievePresignedUrl'
import { Spinner } from '../../Elements/Spinner'

interface MediaContentProps extends React.HTMLAttributes<HTMLFormElement> {
  content: SlideContent
}

export function MediaContent({ content }: MediaContentProps) {
  const [imageUrl, setImageUrl] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  React.useEffect(() => {
    const getImageWrapper = async () => {
      await getImage(content)
    }
    getImageWrapper()
  }, [])

  async function getImage(stepItem: SlideContent) {
    setIsLoading(true)
    const fileName = stepItem.imageId + '_' + stepItem.content
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
        <Image
          alt={content.content}
          height={200}
          src={imageUrl ? imageUrl : ''}
          width={200}
        />
      )}
    </div>
  )
}
