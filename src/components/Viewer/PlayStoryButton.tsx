import { PlayIcon } from '@radix-ui/react-icons'
import { Button } from '../Elements/Button'
import { usePathname, useRouter } from 'next/navigation'
import { cx } from 'class-variance-authority'

type Props = {
  slug: string
  size?: 'xs' | 's' | 'm'
}
export default function PlayStoryButton({ slug, size }: Props) {
  const path = usePathname()
  const router = useRouter()

  function startStory() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    router.push(`${pathLocal}/${slug}/0`)
  }

  return (
    <Button
      className="hover:bg-slate-100 "
      onClick={() => startStory()}
      size="sm"
      variant={'noStyle'}
    >
      <PlayIcon
        className={cx(
          size == 'xs' ? 'h-5 w-5' : '',
          size == 's' ? 'h-10 w-10' : '',
          size == 'm' ? 'h-60 w-60' : '',
        )}
      ></PlayIcon>
    </Button>
  )
}
