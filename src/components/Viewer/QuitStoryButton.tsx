import { Cross1Icon } from '@radix-ui/react-icons'
import { usePathname, useRouter } from 'next/navigation'
import { cx } from 'class-variance-authority'

type Props = {
  slug: string
  // when set, renders icon + text instead of an icon-only button
  label?: string
  className?: string
}
export default function QuitStoryButton({ label, className }: Props) {
  const path = usePathname()
  const router = useRouter()

  function onClose() {
    const pathLocal = path?.split('/').splice(2, 2)
    if (pathLocal) {
      pathLocal[1] = 'all'
      const newPath = pathLocal.join('/') ?? 'gallery/all/story/'
      router.push(`/${newPath}`)
    }
  }
  return (
    <button
      aria-label="Quit Story"
      className={cx(
        'flex h-9 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-100',
        label ? 'px-3' : 'w-9',
        className,
      )}
      onClick={() => onClose()}
      title="Quit Story"
    >
      <Cross1Icon className="h-5 w-5" />
      {label && <span>{label}</span>}
    </button>
  )
}
