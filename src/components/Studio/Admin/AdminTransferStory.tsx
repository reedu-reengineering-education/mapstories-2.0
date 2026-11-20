'use client'

import { useState } from 'react'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { Button } from '@/src/components/Elements/Button'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { useAdminTransferStory } from '@/src/lib/api/admin/useAdminTransferStory'

export default function AdminTransferStory() {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'admin')
  const [storyIdInput, setStoryIdInput] = useState('')
  const [sourceEmailInput, setSourceEmailInput] = useState('')
  const [targetEmailInput, setTargetEmailInput] = useState('')
  const { loading, transferStory } = useAdminTransferStory()

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await transferStory(storyIdInput, targetEmailInput)
    if (result) {
      setStoryIdInput('')
      setSourceEmailInput('')
      setTargetEmailInput('')
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        {t('transferStoryTitle')}
      </h2>

      <form className="space-y-4" onSubmit={handleTransfer}>
        <div>
          <InputLabel>{t('storyId')}</InputLabel>
          <Input
            disabled={loading}
            onChange={e => setStoryIdInput(e.target.value)}
            placeholder={t('transferStoryIdPlaceholder')}
            type="text"
            value={storyIdInput}
          />
          <p className="text-sm text-slate-500 mt-2">
            {t('transferStoryDescription')}
          </p>
        </div>

        <div>
          <InputLabel>{t('sourceUserEmail')}</InputLabel>
          <Input
            disabled={true}
            placeholder={t('sourceUserEmailPlaceholder')}
            type="email"
            value={sourceEmailInput}
          />
          <p className="text-sm text-slate-500 mt-2">
            {t('sourceUserEmailDescription')}
          </p>
        </div>

        <div>
          <InputLabel>{t('targetUserEmail')}</InputLabel>
          <Input
            disabled={loading}
            onChange={e => setTargetEmailInput(e.target.value)}
            placeholder={t('targetUserEmailPlaceholder')}
            type="email"
            value={targetEmailInput}
          />
          <p className="text-sm text-slate-500 mt-2">
            {t('targetUserEmailDescription')}
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            disabled={
              loading ||
              !storyIdInput.trim() ||
              !targetEmailInput.trim()
            }
            type="submit"
            variant="primary"
          >
            {loading ? t('transferring') : t('transferStory')}
          </Button>
        </div>
      </form>
    </div>
  )
}
