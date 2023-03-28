import {
  InstagramLogoIcon,
  TwitterLogoIcon,
  VideoIcon,
} from '@radix-ui/react-icons'
import { PadletIcon } from '../../Icons'
import { FacebookIcon } from '../../Icons'
import { WikipediaIcon } from '../../Icons'
import { TiktokIcon } from '../../Icons'
import { Tooltip } from '../../Tooltip'

export default function MediaIconList() {
  const icons = [
    <InstagramLogoIcon className="h-6 w-6 pl-2" key={'Instagram'} />,
    <TwitterLogoIcon className="h-6 w-6 pl-2" key={'Twitter'} />,
    <VideoIcon className="h-6 w-6 pl-2" key={'Youtube'} />,
    <PadletIcon className="h-6 w-6 pl-2" key={'Padlet'} />,
    <FacebookIcon
      className="h-5 w-5 bg-[#4267B2] pl-2 text-white"
      key={'Facebook'}
    />,
    <WikipediaIcon className="h-6 w-6 pl-2" key={'Wikipedia'} />,
    <TiktokIcon className="h-6 w-6 pl-2" key={'Tiktok'} />,
  ]
  return (
    <div className="flex">
      {icons.map(icon => (
        <Tooltip content={icon.key as string} key={icon.key}>
          {icon}
        </Tooltip>
      ))}
    </div>
  )
}
