import { PlayIcon } from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'
import { navigateToStep } from '@/src/lib/viewerNavigation'

type Props = {
  slug: string
  label: string
}
export default function PlayStoryButton({ slug, label }: Props) {
  const path = usePathname()
  const pathLocal =
    path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

  return (
    <a
      className="flex h-11 items-center gap-2 rounded-full bg-button-color pl-4 pr-6 font-medium text-white shadow-sm transition-opacity hover:opacity-90"
      href={`/${pathLocal}/${slug}/0`}
      onClick={e => {
        // plain clicks switch the step client-side; modifier clicks open a tab
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
          return
        }
        e.preventDefault()
        navigateToStep(0)
      }}
    >
      <PlayIcon className="h-5 w-5" />
      {label}
    </a>
  )
}
