'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LanguageIcon } from '@heroicons/react/24/outline'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import { availableStoryLanguages } from '@/src/lib/languageFlags'
import { createTranslationRequest } from '@/src/lib/api/story/createTranslationRequest'
import { toast } from '@/src/lib/toast'
import { LanguageSelect } from '@/src/components/Elements/LanguageSelect'

type Props = {
  story: any
  currentUserId?: string
}

// Lets logged in users (not the author) start a community translation of a
// story. The translation is edited in the storylab and later submitted to
// the author for approval.
export function AddTranslationButton({ story, currentUserId }: Props) {
  const router = useRouter()
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  // @ts-ignore useTranslation type overloads are complex
  const { t } = useTranslation(lng, 'translationRequests')
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState<string>()
  const [loading, setLoading] = useState(false)

  const existingLanguages = new Set<string>(
    story?.group?.stories?.map((s: any) => s.language) ?? [story?.language],
  )
  const missingLanguages = availableStoryLanguages.filter(
    l => !existingLanguages.has(l.code),
  )

  if (
    !story ||
    !currentUserId ||
    story.ownerId === currentUserId ||
    missingLanguages.length === 0
  ) {
    return null
  }

  async function onCreate() {
    if (!language) {
      return
    }
    setLoading(true)
    try {
      const { data } = await createTranslationRequest(story.id, language)
      router.push(`/storylab/${data.slug}/${data.firstStepId ?? ''}`)
    } catch (error: any) {
      const exists = error?.response?.data?.code === 'EXISTS'
      toast({
        title: t('createError'),
        message: exists ? t('languageExists') : t('createError'),
        type: 'error',
      })
      setLoading(false)
    }
  }

  return (
    <Modal
      onOpenChange={value => {
        setOpen(value)
        if (!value) {
          setLanguage(undefined)
        }
      }}
      open={open}
      title={t('addTranslation')}
      trigger={
        <Button
          size="sm"
          startIcon={<LanguageIcon className="w-4" />}
          variant="inverse"
        >
          {t('addTranslation')}
        </Button>
      }
    >
      <Modal.Content>
        <p className="mb-4 text-sm text-slate-600">
          {t('addTranslationDescription')}
        </p>
        <p className="mb-2 text-sm font-medium text-slate-800">
          {t('chooseLanguage')}
        </p>
        <LanguageSelect
          languages={missingLanguages}
          onChange={setLanguage}
          placeholder={t('chooseLanguagePlaceholder')}
          value={language}
        />
        <ol className="mt-6 list-decimal space-y-1 pl-5 text-xs text-slate-500">
          <li>{t('flowStep1')}</li>
          <li>{t('flowStep2')}</li>
          <li>{t('flowStep3')}</li>
        </ol>
      </Modal.Content>
      <Modal.Footer>
        <Button
          className="w-full"
          disabled={!language || loading}
          isLoading={loading}
          onClick={onCreate}
        >
          {t('startTranslation')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
