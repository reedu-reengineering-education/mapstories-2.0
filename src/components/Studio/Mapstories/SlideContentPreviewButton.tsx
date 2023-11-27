import { Media, SlideContent } from '@prisma/client'

import { cx } from 'class-variance-authority'
import dynamic from 'next/dynamic'
import { OgObject } from 'open-graph-scraper/dist/lib/types'
import { HTMLAttributes, useEffect, useState } from 'react'
import EmbedIconFactory from '../../Icons/EmbedIconFactory'
import SizedImage from '../../Elements/SizedImage'
import { getS3Image } from '@/src/helper/getS3Image'
import useMedia from '@/src/lib/api/media/useMedia'

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
})

const markdownPreviewStyles = {
  background: 'white',
  fontFamily: 'inherit',
}

function Wrapper(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx('flex items-center gap-2', props.className)}
      {...props}
    />
  )
}

export default function SlideContentPreviewButton({
  content,
  type,
  ogData,
  ...props
}: SlideContent) {
  const og = ogData as OgObject | null

  const { getMedia } = useMedia(props.storyStepId)

  const [mediaUrl, setMediaUrl] = useState(String)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (type == 'IMAGE') {
      const getMediaWrapper = async () => {
        const media = await getMedia(props.mediaId!)
        const response = await getS3Image(media as Media)
        setMediaUrl(response)
      }
      getMediaWrapper()
    }
    if (type == 'EXTERNALIMAGE') {
      const getExternalMediaWrapper = async () => {
        const mediaId = await getMedia(props.mediaId!)
        if (mediaId.url) {
          setMediaUrl(mediaId.url)
        }
      }
      getExternalMediaWrapper()
    }
  }, [])

  function IconComponent() {
    return <EmbedIconFactory className="my-1 h-8 border-none" type={type} />
  }

  if (type == 'TEXT') {
    return (
      <Wrapper>
        <IconComponent />
        <div className="hover:bg-hover">
          {content.replaceAll('*', '').replaceAll('~', '')}
        </div>
      </Wrapper>
    )
  }

  const previewContent = og?.ogTitle ?? content

  if (type == 'TITLE') {
    return (
      <Wrapper>
        <IconComponent />
        {previewContent.length > 13
          ? previewContent.substring(0, 12) + '...'
          : previewContent}
      </Wrapper>
    )
  }

  if (type == 'IMAGE' || type == 'EXTERNALIMAGE') {
    return (
      <Wrapper>
        <IconComponent />
        <SizedImage alt={content} size="xs" src={mediaUrl} />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <IconComponent />
      {previewContent.length > 13
        ? previewContent.substring(0, 10) + '...'
        : previewContent}
    </Wrapper>
  )
}
