'use client'

import { useRouter } from 'next/navigation'

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
  // Current position in viewer: slug[0] = story slug, slug[1] = step index or 'start'
  currentSlug?: string[]
}

// Language switcher for the viewer. Only rendered when the story exists in
// more than one language. Swaps the story slug while preserving the current step.
export function StoryLanguageSwitcher({ story, currentSlug }: Props) {
  const router = useRouter()

  const variants = story.group?.stories ?? []
  if (variants.length <= 1) {
    return null
  }

  const current = getLanguageInfo(story.language)

  function switchTo(targetSlug: string) {
    // Build new URL using the current path structure, replacing only the story slug
    if (!currentSlug || currentSlug.length === 0) {
      return
    }

    // currentSlug[0] is the story slug, currentSlug[1] is the step index or 'start'
    const stepIndex = currentSlug[1] ?? 'start'
    
    // Reconstruct the path by replacing story slug but keeping the step
    // The route is: /[lng]/gallery|mystories|embed/[filter]/story/[slug]/[stepIndex]
    // We need to navigate to: /[lng]/gallery|mystories|embed/[filter]/story/[newSlug]/[stepIndex]
    
    // Get the current pathname and replace the old slug with the new one
    const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
    const segments = pathname.split('/').filter(Boolean) // Remove empty segments
    
    // Find the story slug position (should be after 'story')
    const storyIndex = segments.indexOf('story')
    if (storyIndex === -1 || storyIndex + 1 >= segments.length) {
      return
    }

    // Replace the old slug with new slug, keep everything else (including step index)
    segments[storyIndex + 1] = targetSlug
    const newPath = '/' + segments.join('/')
    
    router.push(newPath)
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
