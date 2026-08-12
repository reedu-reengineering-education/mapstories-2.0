'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon } from '@heroicons/react/24/outline'

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
}

type Props = {
  story: any
}

export default function LanguageBar({ story }: Props) {
  const router = useRouter()
  const lng = useBoundStore(state => state.language)
  // @ts-ignore useTranslation type overloads are complex
  const { t: tBase } = useTranslation(lng, 'settingsModal')
  const t = tBase as any
  const { addLanguage } = useStory(story.id)
  const [loading, setLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

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

  async function onAddLanguage(language: string) {
    setLoading(true)
    try {
      const created: any = await addLanguage(language)
      toast({
        title: getLanguageInfo(language).label,
        message: t('settingsModal:languageAdded'),
        type: 'success',
      })
      if (created?.slug && created?.firstStepId) {
        router.push(`/storylab/${created.slug}/${created.firstStepId}`)
      } else {
        router.refresh()
      }
    } catch (e) {
      toast({
        title: t('settingsModal:languageAddError'),
        message: t('settingsModal:languageAddError'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
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
          return (
            <Tooltip content={info.label} key={v.id}>
              <button
                aria-label={info.label}
                className={
                  'rounded-md px-1.5 py-0.5 text-lg transition ' +
                  (active
                    ? 'bg-slate-200'
                    : 'opacity-60 hover:opacity-100')
                }
                disabled={active}
                onClick={() =>
                  router.push(
                    `/storylab/${v.slug}/${v.firstStepId ?? ''}`,
                  )
                }
              >
                {info.flag}
              </button>
            </Tooltip>
          )
        })}

      {missingLanguages.length > 0 && (
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
            <DropdownMenu.Content align="start" className="z-[100] mt-2">
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
      )}

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
    </div>
  )
}
