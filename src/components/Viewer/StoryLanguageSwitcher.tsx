'use client'

import { usePathname, useRouter } from 'next/navigation'

import { DropdownMenu } from '@/src/components/Dropdown'
import { getLanguageInfo } from '@/src/lib/languageFlags'

type Variant = {
  id: string
  slug: string
  language: string
}

type Props = {
  story: {
    language: string
    group?: { stories: Variant[] } | null
  }
}

// Language switcher for the viewer. Only rendered when the story exists in
// more than one language. Swaps the story slug in the URL and keeps the step.
export function StoryLanguageSwitcher({ story }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const variants = story.group?.stories ?? []
  if (variants.length <= 1) {
    return null
  }

  const current = getLanguageInfo(story.language)

  function switchTo(targetSlug: string) {
    if (!pathname) {
      return
    }
    const segments = pathname.split('/')
    const storyIndex = segments.indexOf('story')
    if (storyIndex === -1 || storyIndex + 1 >= segments.length) {
      return
    }
    segments[storyIndex + 1] = targetSlug
    router.push(segments.join('/'))
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label={current.label}
          className="flex items-center gap-1 rounded-md px-2 text-lg hover:bg-slate-100"
        >
          {current.flag}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="z-[100] mt-2">
          {variants
            .slice()
            .sort((a, b) => a.language.localeCompare(b.language))
            .map(v => {
              const info = getLanguageInfo(v.language)
              const active = v.language === story.language
              return (
                <DropdownMenu.Item
                  className={
                    'cursor-pointer ' + (active ? 'bg-slate-100' : '')
                  }
                  key={v.id}
                  onClick={() => !active && switchTo(v.slug)}
                >
                  {info.flag} {info.label}
                </DropdownMenu.Item>
              )
            })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
