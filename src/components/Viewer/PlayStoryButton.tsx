import { PlayIcon } from '@radix-ui/react-icons'
import { Button } from '../Elements/Button'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  slug: string
}
export default function PlayStoryButton({ slug }: Props) {
  const path = usePathname()
  const router = useRouter()

  function startStory() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    router.push(`${pathLocal}/${slug}/0`)
  }

  return (
    <Button onClick={() => startStory()} size="sm" variant={'noStyle'}>
      <PlayIcon className="h-5 w-5"></PlayIcon>
    </Button>
  )
}
