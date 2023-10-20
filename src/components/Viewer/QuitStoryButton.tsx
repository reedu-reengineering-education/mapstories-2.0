import { Cross1Icon } from '@radix-ui/react-icons'
import { Button } from '../Elements/Button'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  slug: string
}
export default function QuitStoryButton({ slug }: Props) {
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
      onClick={() => onClose()}
      variant="noStyle"
    >
      <Cross1Icon />
    </Button>
  )
}
