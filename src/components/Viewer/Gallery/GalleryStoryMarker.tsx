'use client'

import { KeyboardEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { PlayIcon } from '@heroicons/react/24/solid'
import { Media, SlideContent, Story, StoryStep, Theme } from '@prisma/client'
import logoNoText from '@/assets/logos/logo_no_text.png'
import bfdwConnectLogo from '@/assets/images/logo/bfdw-connect-logo.png'
import { getS3Image } from '@/src/helper/getS3Image'
import useMedia from '@/src/lib/api/media/useMedia'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import { getBfdwTopic } from '@/src/lib/bfdwTopics'
import { useIsBfdwSite } from '@/src/lib/hooks/useIsBfdwSite'

const DEFAULT_ACCENT = '#18325b'

// Card dimensions in px. The card layout is fixed (16:9 image, 2-line title)
// so the gallery can compute overlaps and stack layouts without measuring.
export function getGalleryCardSize(viewportWidth: number) {
  const width = viewportWidth >= 768 ? 208 : 160
  // border-top 4 + image 16:9 + text block 76 + arrow 8
  const height = Math.round(4 + (width * 9) / 16 + 76 + 8)
  return { width, height }
}

// Stories are colored by their topic area, otherwise by their theme.
export function getStoryAccent(story?: {
  theme?: Theme | null
  topic?: string | null
}) {
  const topic = getBfdwTopic(story?.topic)
  if (topic) {
    return topic.color
  }
  const theme = story?.theme
  return theme?.button_color || theme?.border || DEFAULT_ACCENT
}

type StepWithContent = StoryStep & { content: SlideContent[] }

type Props = {
  story: Story & {
    theme?: Theme | null
    firstStep?: StepWithContent | null
    steps: StepWithContent[]
  }
  onSelect: () => void
  onHoverChange?: (hovered: boolean) => void
  // another story is hovered -> fade this one into the background
  dimmed?: boolean
  // card width in px, see getGalleryCardSize
  width?: number
  showArrow?: boolean
  // false for cards that are only decoration (e.g. behind a collapsed stack)
  interactive?: boolean
}

// First image of the title slide, otherwise the first image of any step.
function findPreviewImage(story: Props['story']): SlideContent | undefined {
  const isImage = (c: SlideContent) => c.type === 'IMAGE'
  const fromFirstStep = story.firstStep?.content?.find(isImage)
  if (fromFirstStep) {
    return fromFirstStep
  }
  const sortedSteps = [...(story.steps ?? [])].sort(
    (a, b) => a.position - b.position,
  )
  for (const step of sortedSteps) {
    const image = step.content?.find(isImage)
    if (image) {
      return image
    }
  }
  return undefined
}

export function GalleryStoryMarker({
  story,
  onSelect,
  onHoverChange,
  dimmed = false,
  width = 208,
  showArrow = true,
  interactive = true,
}: Props) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  // @ts-ignore useTranslation type overloads are complex
  const { t } = useTranslation(lng, 'mapstoryCard')
  const { getMedia } = useMedia()

  const previewContent = findPreviewImage(story)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(!!previewContent?.mediaId)

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | undefined

    const load = async () => {
      if (!previewContent?.mediaId) {
        setImageLoading(false)
        return
      }
      try {
        const media = (await getMedia(previewContent.mediaId)) as Media
        objectUrl = await getS3Image(media)
        if (!cancelled) {
          setImageUrl(objectUrl)
        }
      } catch (e) {
        console.warn('Could not load gallery preview image', e)
      } finally {
        if (!cancelled) {
          setImageLoading(false)
        }
      }
    }
    load()

    return () => {
      cancelled = true
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
    // only reload when the preview media changes
  }, [previewContent?.mediaId])

  const accent = getStoryAccent(story)
  const isBfdwSite = useIsBfdwSite()
  const topic = getBfdwTopic(story.topic)
  const stationCount = story.steps?.length ?? 0

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <div
      aria-hidden={interactive ? undefined : true}
      aria-label={interactive ? story.name ?? undefined : undefined}
      className={`group relative pb-2 outline-none transition-[transform,opacity,filter] duration-200 ease-out ${
        interactive
          ? 'cursor-pointer hover:-translate-y-1 hover:scale-[1.04] focus-visible:-translate-y-1'
          : 'pointer-events-none'
      } ${dimmed ? 'scale-95 opacity-40 saturate-50' : ''}`}
      onBlur={interactive ? () => onHoverChange?.(false) : undefined}
      onClick={interactive ? onSelect : undefined}
      onFocus={interactive ? () => onHoverChange?.(true) : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
      onMouseEnter={interactive ? () => onHoverChange?.(true) : undefined}
      onMouseLeave={interactive ? () => onHoverChange?.(false) : undefined}
      role={interactive ? 'button' : undefined}
      style={{ width }}
      tabIndex={interactive ? 0 : -1}
    >
      <div
        className="overflow-hidden rounded-xl border-t-4 bg-white shadow-lg ring-1 ring-black/5 transition-shadow duration-200 group-hover:shadow-2xl group-focus-visible:ring-2 group-focus-visible:ring-sky-500"
        style={{ borderTopColor: accent }}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          {topic && (
            <span
              className="absolute bottom-1.5 left-1.5 z-[1] max-w-[calc(100%-0.75rem)] truncate rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-white shadow"
              style={{ backgroundColor: topic.color }}
              title={topic.label}
            >
              {topic.label}
            </span>
          )}
          {imageLoading && (
            <div className="h-full w-full animate-pulse bg-slate-200" />
          )}
          {!imageLoading && imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={story.name ?? 'Mapstory'}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={imageUrl}
            />
          )}
          {!imageLoading && !imageUrl && (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: `${accent}1a` }}
            >
              {isBfdwSite ? (
                <Image
                  alt="Connect Logo"
                  className="h-full w-full object-contain"
                  src={bfdwConnectLogo}
                />
              ) : (
                <Image
                  alt="Mapstories Logo"
                  className="h-12 w-12 opacity-80"
                  src={logoNoText}
                />
              )}
            </div>
          )}
        </div>
        <div className="flex items-end justify-between gap-2 px-3 py-2">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 h-[2.75em] text-sm font-semibold leading-snug text-slate-900">
              {story.name}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {t('stations', { count: stationCount })}
            </p>
          </div>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: accent }}
          >
            <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
          </span>
        </div>
      </div>
      {/* arrow pointing at the story location */}
      {showArrow && (
        <div className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-white drop-shadow" />
      )}
    </div>
  )
}
