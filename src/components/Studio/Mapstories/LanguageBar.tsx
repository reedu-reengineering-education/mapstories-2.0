'use client'

import { useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'
import {
  PaperAirplaneIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

import { DropdownMenu } from '@/src/components/Dropdown'
import { Tooltip } from '@/src/components/Tooltip'
import { Modal } from '@/src/components/Modal'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import useStory from '@/src/lib/api/story/useStory'
import {
  availableStoryLanguages,
  getLanguageInfo,
} from '@/src/lib/languageFlags'
import { InfoCircledIcon } from '@radix-ui/react-icons'

type Variant = {
  id: string
  slug: string
  language: string
  firstStepId?: string | null
  steps?: Array<{ id: string; position: number }>
}

type Props = {
  story: any
  // contributors (translators of an approved translation) can't add/delete languages
  isOwner?: boolean
}

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  PENDING: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-800',
  APPROVED: 'bg-green-100 text-green-800',
}

export default function LanguageBar({ story, isOwner = true }: Props) {
  const router = useRouter()
  const params = useParams()
  const { mutate } = useSWRConfig()
  const lng = useBoundStore(state => state.language)
  // @ts-ignore useTranslation type overloads are complex
  const { t: tBase } = useTranslation(lng, 'settingsModal')
  const t = tBase as any
  // @ts-ignore useTranslation type overloads are complex
  const { t: tTr } = useTranslation(lng, 'translationRequests')
  const { addLanguage, deleteLanguage, submitTranslation } = useStory(story.id)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ language: string; variantId: string } | null>(null)
  const [hoveredVariantId, setHoveredVariantId] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function startHoverTimer(variantId: string) {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => setHoveredVariantId(variantId), 500)
  }

  function cancelHoverTimer() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setHoveredVariantId(null)
  }

  const currentStepId = params?.storyStepId as string | undefined

  const variants: Variant[] = story.group?.stories?.length
    ? story.group.stories
    : [
        {
          id: story.id,
          slug: story.slug,
          language: story.language,
          firstStepId: story.firstStepId,
        },
      ]

  const existingLanguages = new Set(variants.map(v => v.language))
  const missingLanguages = availableStoryLanguages.filter(
    l => !existingLanguages.has(l.code),
  )

  // Find the position of the current step in the current story
  function getCorrespondingStepId(targetVariant: Variant): string | undefined {
    if (!currentStepId || !story.steps) {
      return targetVariant.firstStepId ?? undefined
    }

    // Find current step position
    const currentStep = story.steps.find((s: any) => s.id === currentStepId)
    if (!currentStep) {
      return targetVariant.firstStepId ?? undefined
    }

    const currentPosition = currentStep.position

    // Find the target step at the same position
    if (targetVariant.steps) {
      const targetStep = targetVariant.steps.find(s => s.position === currentPosition)
      if (targetStep) {
        return targetStep.id
      }
    }

    return targetVariant.firstStepId ?? undefined
  }

  async function onAddLanguage(language: string) {
    setLoading(true)
    try {
      const created: any = await addLanguage(language)
      // sibling variant pages cache their own story via SWR and won't see the new language otherwise
      await mutate(
        (key: unknown) => typeof key === 'string' && key.startsWith('/api/mapstory/'),
        undefined,
        { revalidate: true },
      )
      toast({
        title: getLanguageInfo(language).label,
        message: t('settingsModal:languageAdded'),
        type: 'success',
      })
      if (created?.slug && created?.firstStepId) {
        router.push(`/storylab/${created.slug}/${created.firstStepId}`)
        // bypass the client Router Cache, which would otherwise serve the stale sibling layout
        router.refresh()
      } else {
        router.refresh()
      }
    } catch {
      toast({
        title: t('settingsModal:languageAddError'),
        message: t('settingsModal:languageAddError'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  async function onDeleteLanguage(language: string, variantId: string) {
    setLoading(true)
    try {
      await deleteLanguage(language, variantId)
      await mutate(
        (key: unknown) => typeof key === 'string' && key.startsWith('/api/mapstory/'),
        undefined,
        { revalidate: true },
      )
      toast({
        title: getLanguageInfo(language).label,
        message: t('settingsModal:languageDeleted'),
        type: 'success',
      })
      setDeleteConfirm(null)
      router.refresh()
    } catch {
      toast({
        title: t('settingsModal:languageDeleteError'),
        message: t('settingsModal:languageDeleteError'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmitTranslation() {
    setLoading(true)
    try {
      await submitTranslation()
      toast({
        title: tTr('submitted'),
        message: tTr('submittedMessage'),
        type: 'success',
      })
      setShowSubmitConfirm(false)
      router.refresh()
    } catch {
      toast({
        title: tTr('submitError'),
        message: tTr('submitError'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  // Community translation draft: not part of the language group yet, it has
  // to be submitted to the original author first.
  if (story.translationStatus && !story.groupId) {
    const info = getLanguageInfo(story.language)
    const canSubmit =
      story.translationStatus === 'DRAFT' ||
      story.translationStatus === 'REJECTED'
    return (
      <div className="re-basic-box flex items-center gap-2 bg-white px-2 py-1">
        <span className="px-1.5 text-lg">{info.flag}</span>
        <span
          className={
            'rounded-full px-2 py-0.5 text-xs font-medium ' +
            (statusStyles[story.translationStatus] ?? '')
          }
        >
          {tTr(`status${story.translationStatus}` as 'statusDRAFT')}
        </span>
        {canSubmit && (
          <button
            className="flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-xs text-white transition hover:bg-slate-700 disabled:opacity-50"
            disabled={loading}
            onClick={() => setShowSubmitConfirm(true)}
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            {tTr('submit')}
          </button>
        )}
        <Modal
          onOpenChange={setShowSubmitConfirm}
          open={showSubmitConfirm}
          title={tTr('submitTitle')}
        >
          <div className="px-6 pb-6">
            <p className="mb-6 text-base text-slate-600">
              {tTr('submitDescription', {
                story: story.translationOf?.name ?? '',
              })}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-md px-4 py-2 text-slate-700 transition hover:bg-slate-100"
                disabled={loading}
                onClick={() => setShowSubmitConfirm(false)}
              >
                {tTr('cancel')}
              </button>
              <button
                className="rounded-md bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700 disabled:opacity-50"
                disabled={loading}
                onClick={onSubmitTranslation}
              >
                {tTr('submitConfirm')}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  // Contributors only edit their translation, other variants belong to the author.
  if (!isOwner) {
    const info = getLanguageInfo(story.language)
    return (
      <div className="re-basic-box flex items-center gap-1 bg-white px-2 py-1">
        <Tooltip content={info.label} side="bottom">
          <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-lg">
            {info.flag}
          </span>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="re-basic-box flex items-center gap-1 bg-white px-2 py-1">
      <Tooltip content={t('settingsModal:addLanguage')} side="bottom">
        <button
          aria-label={t('settingsModal:languageInstructions')}
          className="text-slate-600 hover:text-slate-900 transition p-1 rounded hover:bg-slate-100"
          onClick={() => setShowInstructions(true)}
        >
          <InfoCircledIcon className="w-5 h-5" />
        </button>
      </Tooltip>
      {variants
        .slice()
        .sort((a, b) => a.language.localeCompare(b.language))
        .map(v => {
          const info = getLanguageInfo(v.language)
          const active = v.language === story.language
          const canDelete = !active && variants.length > 1
          const showDelete = canDelete && hoveredVariantId === v.id
          return (
            <div
              className="relative flex items-center"
              key={v.id}
              onMouseEnter={() => canDelete && startHoverTimer(v.id)}
              onMouseLeave={cancelHoverTimer}
            >
              <Tooltip content={info.label} side="bottom">
                <button
                  aria-label={info.label}
                  className={
                    'rounded-md px-1.5 py-0.5 text-lg transition ' +
                    (active
                      ? 'bg-slate-200'
                      : 'opacity-60 hover:opacity-100')
                  }
                  disabled={active}
                  onClick={() => {
                    const targetStepId = getCorrespondingStepId(v)
                    router.push(`/storylab/${v.slug}/${targetStepId ?? ''}`)
                    // bypass the client Router Cache, which would otherwise serve a stale sibling layout
                    router.refresh()
                  }}
                >
                  {info.flag}
                </button>
              </Tooltip>
              {canDelete && (
                <Tooltip content={t('settingsModal:deleteLanguage')} side="top">
                  <button
                    aria-label={t('settingsModal:deleteLanguage')}
                    className={
                      'absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 p-1.5 text-white shadow transition-all duration-200 hover:bg-red-700 ' +
                      (showDelete
                        ? 'opacity-100 -translate-y-1 pointer-events-auto'
                        : 'opacity-0 translate-y-0 pointer-events-none')
                    }
                    disabled={loading}
                    onClick={() => setDeleteConfirm({ language: v.language, variantId: v.id })}
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </Tooltip>
              )}
            </div>
          )
        })}

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button
            aria-label={t('settingsModal:addLanguage')}
            className="ml-1 rounded-md p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            disabled={loading}
          >
            <PlusIcon className="w-4" />
          </button>
        </DropdownMenu.Trigger>
    
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            className="z-[100] mt-2 max-h-80 overflow-y-auto"
          >
            {missingLanguages.map(l => (
              <DropdownMenu.Item
                className="cursor-pointer"
                key={l.code}
                onClick={() => onAddLanguage(l.code)}
              >
                {l.flag} {l.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>

      <Modal 
        onOpenChange={setShowInstructions} 
        open={showInstructions}
        title={t('settingsModal:addLanguageInstructions')}
      >
        <div className="px-6 pb-6">
          <p className="text-base text-slate-600 mb-8 leading-relaxed">
            {t('settingsModal:addLanguageHelp')}
          </p>
          
          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
                  <span className="text-slate-900 font-semibold text-sm">1</span>
                </div>
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-slate-700">
                  {t('settingsModal:instructionStep1')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
                  <span className="text-slate-900 font-semibold text-sm">2</span>
                </div>
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-slate-700">
                  {t('settingsModal:instructionStep2')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
                  <span className="text-slate-900 font-semibold text-sm">3</span>
                </div>
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-slate-700">
                  {t('settingsModal:instructionStep3')}
                </p>
              </div>
            </div>
          </div>

          {/* Closing hint */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Click the plus icon to get started
            </p>
          </div>
        </div>
      </Modal>

      <Modal 
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        open={deleteConfirm !== null}
        title={t('settingsModal:deleteLanguageTitle')}
      >
        <div className="px-6 pb-6">
          <p className="text-base text-slate-600 mb-6">
            {t('settingsModal:deleteLanguageWarning', {
              language: deleteConfirm ? getLanguageInfo(deleteConfirm.language).label : '',
            })}
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              className="px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100 transition"
              disabled={loading}
              onClick={() => setDeleteConfirm(null)}
            >
              {t('settingsModal:cancel')}
            </button>
            <button
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              disabled={loading}
              onClick={() => {
                if (deleteConfirm) {
                  onDeleteLanguage(deleteConfirm.language, deleteConfirm.variantId)
                }
              }}
            >
              {loading ? t('settingsModal:deleting') : t('settingsModal:deleteLanguageConfirm')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
