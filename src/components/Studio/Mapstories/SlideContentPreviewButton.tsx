import { MediaType, SlideContent } from '@prisma/client'
import {
  ClipboardIcon,
  ClockIcon,
  FaceIcon,
  HeadingIcon,
  InstagramLogoIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  PlayIcon,
  TextIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import { cx } from 'class-variance-authority'
import dynamic from 'next/dynamic'
import { OgObject } from 'open-graph-scraper/dist/lib/types'
import { HTMLAttributes } from 'react'

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
})

const markdownPreviewStyles = {
  background: 'white',
  fontFamily: 'inherit',
}

const getIcon = (type: MediaType) => {
  switch (type) {
    case 'TEXT':
      return TextIcon
    case 'TITLE':
      return HeadingIcon
    case 'TWITTER':
      return TwitterLogoIcon
    case 'YOUTUBE':
      return PlayIcon
    case 'INSTAGRAM':
      return InstagramLogoIcon
    case 'TIKTOK':
      return ClockIcon
    case 'PADLET':
      return ClipboardIcon
    case 'FACEBOOK':
      return FaceIcon
    case 'WIKIPEDIA':
      return MagnifyingGlassIcon
    default:
      return PersonIcon
  }
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
}: SlideContent) {
  const og = ogData as OgObject | null

  const Icon = getIcon(type)
  function IconComponent() {
    return (
      <div className="flex aspect-square h-10 items-center justify-center rounded-full bg-emerald-200 p-2">
        <Icon className="h-full w-auto text-emerald-900" />
      </div>
    )
  }

  if (type == 'TEXT') {
    return (
      <Wrapper>
        <IconComponent />
        <MarkdownPreview
          className="hover:bg-hover"
          source={content.substring(0, 12) + '...'}
          style={markdownPreviewStyles}
        />
      </Wrapper>
    )
  }

  const previewContent = og?.ogTitle ?? content

  if (type == 'TITLE') {
    return (
      <Wrapper>
        <IconComponent />
        {previewContent.substring(0, 12)}...
      </Wrapper>
    )
  }
  return (
    <Wrapper>
      <IconComponent />
      {previewContent.substring(0, 24)}
    </Wrapper>
  )
}
