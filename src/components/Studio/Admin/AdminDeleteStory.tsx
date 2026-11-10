'use client'

import { useState } from 'react'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { useAdminDeleteStory } from '@/src/lib/api/admin/useAdminDeleteStory'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function AdminDeleteStory() {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'admin')
  const [storyIdInput, setStoryIdInput] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const { loading, deleteStory } = useAdminDeleteStory()

  const handleDelete = async () => {
    const result = await deleteStory(storyIdInput)
    if (result) {
      setStoryIdInput('')
      setShowConfirm(false)
    }
  }

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (storyIdInput.trim()) {
      setShowConfirm(true)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          {t('deleteStoryTitle')}
        </h2>

        <form className="space-y-4" onSubmit={handleOpenConfirm}>
          <div>
            <InputLabel>{t('storyId')}</InputLabel>
            <Input
              disabled={loading}
              onChange={e => setStoryIdInput(e.target.value)}
              placeholder={t('deleteStoryIdPlaceholder')}
              type="text"
              value={storyIdInput}
            />
            <p className="text-sm text-slate-500 mt-2">
              {t('deleteStoryDescription')}
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={loading || !storyIdInput.trim()}
              type="submit"
              variant="primary"
            >
              {loading ? t('deleting') : t('deleteStory')}
            </Button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <Modal
          onClose={() => setShowConfirm(false)}
          open={showConfirm}
          title={
            <span className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              {t('confirmDeletion')}
            </span>
          }
        >
          <div className="bg-white rounded-lg p-6 max-w-md shadow-lg">
            <p className="text-slate-600 mb-2">
              {t('deleteStoryQuestion')}
            </p>
            <p className="text-sm text-slate-500 mb-6">
              {t('storyId')}: <span className="font-mono font-semibold">{storyIdInput}</span>
            </p>
            <p className="text-sm text-red-600 font-medium mb-6">
              {t('deleteStoryWarning')}
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                disabled={loading}
                onClick={() => setShowConfirm(false)}
                variant="inverse"
              >
                {t('cancel')}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
                onClick={handleDelete}
              >
                {loading ? t('deleting') : t('deletePermanently')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
