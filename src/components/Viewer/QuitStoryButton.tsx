import { Cross1Icon } from '@radix-ui/react-icons'
import { Button } from '../Elements/Button'
import { usePathname, useRouter } from 'next/navigation'
import { cx } from 'class-variance-authority'

type Props = {
  slug: string
  size?: 'xs' | 's' | 'm'
}
export default function QuitStoryButton({ slug, size }: Props) {
  const path = usePathname()
  const router = useRouter()

  function onClose() {
    const pathLocal = path?.split('/').splice(2, 2)
    if (pathLocal) {
      pathLocal[1] = 'all'
      const newPath = pathLocal.join('/') ?? 'gallery/all/story/'
      router.push(`${newPath}`)
    }
  }
  return (
    <Button
      aria-label="Restart Story"
      className="p-10 hover:bg-slate-100 "
      onClick={() => onClose()}
      variant="noStyle"
    >
      <Cross1Icon
        className={cx(
          size == 'xs' ? 'h-5 w-5' : '',
          size == 's' ? 'h-10 w-10' : '',
          size == 'm' ? 'h-60 w-60' : '',
        )}
      />
    </Button>
  )
}
