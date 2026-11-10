'use client'

import { useRouter } from 'next/navigation'
import { cx } from 'class-variance-authority'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

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
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 focus-visible:outline-none"
        >
          <span className="text-base leading-none">{current.flag}</span>
          <span>{current.label}</span>
          <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-[100] mt-2 min-w-[160px] p-1 md:w-auto"
        >
          {variants
            .slice()
            .sort((a, b) => a.language.localeCompare(b.language))
            .map(v => {
              const info = getLanguageInfo(v.language)
              const active = v.language === story.language
              return (
                <DropdownMenu.Item
                  className={cx(
                    'cursor-pointer gap-2 rounded-md',
                    active && 'bg-hover font-medium text-black' || '',
                  )}
                  key={v.id}
                  onClick={() => !active && switchTo(v.slug)}
                >
                  <span className="text-base leading-none">{info.flag}</span>
                  <span>{info.label}</span>
                </DropdownMenu.Item>
              )
            })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  )
}
