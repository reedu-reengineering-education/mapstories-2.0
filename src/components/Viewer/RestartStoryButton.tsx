import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '../Elements/Button'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  slug: string
}
export default function RestartStoryButton({ slug }: Props) {
  const path = usePathname()
  const router = useRouter()

  function backToStart() {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    router.push(`${pathLocal}/${slug}/start`)
  }

  return (
    <Button
      aria-label="Restart Story"
      onClick={() => backToStart()}
      variant="noStyle"
    >
      <ReloadIcon />
    </Button>
  )
}
