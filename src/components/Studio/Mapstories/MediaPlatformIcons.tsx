import {
  InstagramLogoIcon,
  TwitterLogoIcon,
  VideoIcon,
} from '@radix-ui/react-icons'
import { PadletIcon } from '../../Icons'
import { FacebookIcon } from '../../Icons'
import { WikipediaIcon } from '../../Icons'
import { TiktokIcon } from '../../Icons'

export default function MediaIconList() {
  const icons = [
    <InstagramLogoIcon className="h-6 w-6 pl-2" key={1} />,
    <TwitterLogoIcon className="h-6 w-6 pl-2" key={2} />,
    <VideoIcon className="h-6 w-6 pl-2" key={3} />,
    <PadletIcon className="h-6 w-6 pl-2" key={4} />,
    <FacebookIcon className="h-5 w-5 bg-[#4267B2] pl-2 text-white" key={5} />,
    <WikipediaIcon className="h-6 w-6 pl-2" key={6} />,
    <TiktokIcon className="h-6 w-6 pl-2" key={7} />,
  ]
  return (
    <div className="flex">
      {icons.map(icon => (
        <div key={icon.key}>{icon}</div>
      ))}
    </div>
  )
}
