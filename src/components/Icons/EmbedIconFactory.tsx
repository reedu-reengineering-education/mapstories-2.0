import { MediaType } from '@prisma/client'
import {
  HeadingIcon,
  ImageIcon,
  InstagramLogoIcon,
  PlayIcon,
  TextIcon,
  TwitterLogoIcon,
  VideoIcon,
} from '@radix-ui/react-icons'
import { cva, cx, VariantProps } from 'class-variance-authority'
import { HTMLAttributes } from 'react'
import { PadletIcon, Spotify } from '.'
import BaseIcon from './BaseIcon'
import SvgDailymotionIcon from './DailymotionIcon'
import SvgFacebookIcon from './FacebookIcon'
import SvgSoundcloudIcon from './SoundcloudIcon'
import SvgTiktokIcon from './TiktokIcon'
import SvgVimeoIcon from './VimeoIcon'
import SvgWikipediaIcon from './WikipediaIcon'

interface EmbedIconFactoryProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconStyle> {}

type cvaType = {
  type: {
    [_key in MediaType]: string
  }
}

const iconStyle = cva<cvaType>('', {
  variants: {
    type: {
      TEXT: 'bg-zinc-100 text-zinc-800',
      TITLE: 'bg-zinc-800 text-zinc-200',
      TWITTER: 'bg-[#1DA1F2] text-white',
      YOUTUBE: 'bg-[#FF0000] text-white',
      INSTAGRAM:
        'bg-gradient-to-br from-[#405DE6] via-[#E1306C] to-[#FFDC80] text-white',
      TIKTOK: 'bg-[#000] text-zinc-[#00f2ea]',
      PADLET: 'bg-zinc-100',
      FACEBOOK: 'bg-[#4267B2] text-white',
      WIKIPEDIA: 'bg-zinc-100',
      SOUNDCLOUD: 'bg-zinc-100',
      DAILYMOTION: 'bg-zinc-100',
      VIMEO: 'bg-zinc-100',
      IMAGE: 'bg-zinc-100',
      VIDEO: 'bg-zinc-100',
      SPOTIFY: 'bg-[#1DB954] p-[4px]',
      EXTERNALIMAGE: 'bg-zinc-100',
      AUDIO: 'bg-zinc-100',
      GOOGLESTREETVIEW: 'bg-zinc-100',
    },
  },
})

const getIcon = (myType: MediaType) => {
  switch (myType) {
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
    case 'SOUNDCLOUD':
      return SvgSoundcloudIcon
    case 'DAILYMOTION':
      return SvgDailymotionIcon
    case 'VIMEO':
      return SvgVimeoIcon
    case 'IMAGE':
      return ImageIcon
    case 'EXTERNALIMAGE':
      return ImageIcon
    case 'VIDEO':
      return VideoIcon
    case 'SPOTIFY':
      return Spotify
    case 'AUDIO':
      return PlayIcon
    case 'GOOGLESTREETVIEW':
      return PlayIcon
    default:
      myType satisfies never // This makes sure the switch case is exhaustive (https://stackoverflow.com/a/75217377/5660646)
  }
}

export default function EmbedIconFactory({
  type,
  className,
  ...props
}: EmbedIconFactoryProps) {
  if (!type) {
    return <BaseIcon {...props} />
  }

  const Icon = getIcon(type)

  if (!Icon) {
    return <BaseIcon {...props} />
  }

  return (
    <BaseIcon className={cx(iconStyle({ type }), className)} {...props}>
      <Icon className="h-full w-auto" />
    </BaseIcon>
  )
}
