import { ReloadIcon } from '@radix-ui/react-icons'
import { navigateToStep } from '@/src/lib/viewerNavigation'

type Props = {
  slug: string
}
export default function RestartStoryButton(_props: Props) {
  return (
    <button
      aria-label="Restart Story"
      className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-slate-100"
      onClick={() => navigateToStep('start')}
      title="Restart Story"
    >
      <ReloadIcon className="h-5 w-5" />
    </button>
  )
}
