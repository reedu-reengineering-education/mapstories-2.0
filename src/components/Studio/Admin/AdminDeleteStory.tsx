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
          Delete Story
        </h2>

        <form onSubmit={handleOpenConfirm} className="space-y-4">
          <div>
            <InputLabel>Story ID</InputLabel>
            <Input
              disabled={loading}
              onChange={e => setStoryIdInput(e.target.value)}
              placeholder="Enter the story ID you want to delete..."
              type="text"
              value={storyIdInput}
            />
            <p className="text-sm text-slate-500 mt-2">
              This action will permanently delete the story and all its content.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              disabled={loading || !storyIdInput.trim()}
              type="submit"
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete Story'}
            </Button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Deletion
              </h3>
            </div>

            <p className="text-slate-600 mb-2">
              Are you sure you want to delete this story?
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Story ID: <span className="font-mono font-semibold">{storyIdInput}</span>
            </p>
            <p className="text-sm text-red-600 font-medium mb-6">
              This action cannot be undone. All steps, content, and connections will be permanently deleted.
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowConfirm(false)}
                variant="secondary"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Deleting...' : 'Delete Permanently'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
