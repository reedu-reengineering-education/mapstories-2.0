'use client'
import * as React from 'react'
import { SlideContent } from '@prisma/client'
import Image from 'next/image'
import { retrievePresignedUrl } from '@/src/helper/retrievePresignedUrl'

interface MediaContentProps extends React.HTMLAttributes<HTMLFormElement> {
  content: SlideContent
}

export function MediaContent({ content }: MediaContentProps) {
  const [imageUrl, setImageUrl] = React.useState<any>(null)
  React.useEffect(() => {
    const getImageWrapper = async () => {
      await getImage(content.content)
    }
    getImageWrapper()
  }, [])

  async function getImage(fileName: string) {
    const preSignedUrl = await retrievePresignedUrl('GET', fileName)
    const response = await fetch(preSignedUrl, { method: 'GET' })
    const blob = await response.blob()
    const src = URL.createObjectURL(blob)
    setImageUrl(src)
  }

  return (
    <div className="py-2">
      <Image
        alt={content.content}
        height={500}
        src={imageUrl ? imageUrl : ''}
        width={500}
      />
    </div>
  )
}
