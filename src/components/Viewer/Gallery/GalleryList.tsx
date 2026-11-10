'use client'

import { SlideContent, Story, StoryStep } from '@prisma/client'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import {
  EnvelopeIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { Button } from '@/src/components/Elements/Button'

type Props = {
  stories: (Story & {
    steps: (StoryStep & { content: SlideContent[] })[]
  })[]
}

const SUBMIT_EMAIL = 'mapstories@vamos-muenster.de'
const ACCENT = '#18325b'
// remembers per browser that the intro was closed
const DISMISSED_KEY = 'gallery-intro-dismissed'

export function GalleryList({ stories }: Props) {
  const [open, setOpen] = useState(true)
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  // @ts-ignore useTranslation type overloads are complex
  const { t } = useTranslation(lng, 'gallery')

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISSED_KEY) === '1') {
        setOpen(false)
      }
    } catch {
      // storage unavailable (private mode etc.) -> just show the intro
    }
  }, [])

  const setOpenPersisted = (value: boolean) => {
    setOpen(value)
    try {
      if (value) {
        window.localStorage.removeItem(DISMISSED_KEY)
      } else {
        window.localStorage.setItem(DISMISSED_KEY, '1')
      }
    } catch {
      // ignore
    }
  }

  // mobile: the intro covers most of the map, so any map interaction hides it
  // (not persisted, unlike the close button – it comes back on next visit)
  useEffect(() => {
    if (!open) {
      return
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!window.matchMedia('(max-width: 767px)').matches) {
        return
      }
      const target = e.target as Element | null
      if (target?.closest?.('.mapboxgl-canvas-container')) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const mailto = `mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent(
    t('gallery_submit_mail_subject'),
  )}&body=${encodeURIComponent(t('gallery_submit_mail_body'))}`

  return (
    <div className="w-80 max-w-[calc(100vw-2.5rem)]">
      <Transition
        appear
        enter="transition duration-500 ease-out"
        enterFrom="opacity-0 -translate-x-6"
        enterTo="opacity-100 translate-x-0"
        leave="transition duration-200 ease-in"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 -translate-x-6"
        show={open}
      >
        {/* swipe left to dismiss (touch) */}
        <motion.div
          className="re-basic-box relative touch-pan-y overflow-hidden bg-white"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0.6, right: 0 }}
          dragSnapToOrigin
          onDragEnd={(_e, info) => {
            if (info.offset.x < -80 || info.velocity.x < -400) {
              setOpenPersisted(false)
            }
          }}
        >
          <button
            aria-label={t('gallery_close')}
            className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:bg-slate-100"
            onClick={() => setOpenPersisted(false)}
            type="button"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <div className="p-4">
            <h3 className="pr-6 text-lg font-bold leading-tight text-slate-900">
              {t('gallery_title')}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t('gallery_intro')}
            </p>
            <p className="mt-2 text-xs text-slate-500">{t('gallery_hint')}</p>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {t('gallery_submit_title')}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {t('gallery_submit_text')}
            </p>
            <a className="mt-3 inline-block" href={mailto} tabIndex={-1}>
              <Button startIcon={<EnvelopeIcon className="w-5" />}>
                {t('gallery_submit_button')}
              </Button>
            </a>
          </div>
        </motion.div>
      </Transition>

      {!open && (
        <button
          className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-lg ring-1 ring-black/5 transition-transform hover:scale-[1.03]"
          onClick={() => setOpenPersisted(true)}
          type="button"
        >
          <InformationCircleIcon className="h-5 w-5" style={{ color: ACCENT }} />
          {t('gallery_eyebrow')}
        </button>
      )}
    </div>
  )
}
