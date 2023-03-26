import { MediaType } from '@prisma/client'
import {
  DotsHorizontalIcon,
  HeadingIcon,
  InstagramLogoIcon,
  PersonIcon,
  PlayIcon,
  TextIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import { cva, cx, VariantProps } from 'class-variance-authority'
import { HTMLAttributes } from 'react'
import { PadletIcon } from '.'
import SvgFacebookIcon from './FacebookIcon'
import SvgTiktokIcon from './TiktokIcon'
import SvgWikipediaIcon from './WikipediaIcon'

interface EmbedIconFactoryProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconStyle> {}

type cvaType = {
  type: {
    [_key in MediaType | 'MORE']: string
  }
}

const iconStyle = cva<cvaType>(
  'flex aspect-square h-10 items-center justify-center rounded-full p-2 border-zinc-200 border-2 shadow',
  {
    variants: {
      type: {
        TEXT: 'bg-zinc-100 text-zinc-800',
        TITLE: 'bg-zinc-800 text-zinc-200',
        TWITTER: 'bg-[#1DA1F2] text-white',
        YOUTUBE: 'bg-[#FF0000] text-white',
        INSTAGRAM:
          'bg-gradient-to-br from-[#405DE6] via-[#E1306C] to-[#FFDC80] text-white',
        TIKTOK: 'bg-black text-zinc-[#00f2ea]',
        PADLET: 'bg-white',
        FACEBOOK: 'bg-[#4267B2] text-white',
        WIKIPEDIA: 'bg-white',
        IMAGE: '',
        VIDEO: '',
        MORE: 'bg-white',
      },
    },
  },
)

const getIcon = (type: MediaType | 'MORE') => {
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
      return SvgTiktokIcon
    case 'PADLET':
      return PadletIcon
    case 'FACEBOOK':
      return SvgFacebookIcon
    case 'WIKIPEDIA':
      return SvgWikipediaIcon
    case 'MORE':
      return DotsHorizontalIcon
    default:
      return PersonIcon
  }
}

export default function EmbedIconFactory({
  type,
  ...props
}: EmbedIconFactoryProps) {
  if (!type) {
    return <div {...props}>{props.children}</div>
  }

  const Icon = getIcon(type)

  return (
    <div className={cx(iconStyle({ type }))} {...props}>
      <Icon className="h-full w-auto" />
    </div>
  )
}
