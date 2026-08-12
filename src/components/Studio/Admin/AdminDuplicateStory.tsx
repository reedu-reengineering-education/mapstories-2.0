'use client'

import { useState } from 'react'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { Button } from '@/src/components/Elements/Button'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { useAdminDuplicateStory } from '@/src/lib/api/admin/useAdminDuplicateStory'

export default function AdminDuplicateStory() {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'admin')
  const [storyIdInput, setStoryIdInput] = useState('')
  const { loading, duplicateStory } = useAdminDuplicateStory()

  const handleDuplicate = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await duplicateStory(storyIdInput)
    if (result) {
      setStoryIdInput('')
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        Duplicate Story
      </h2>

      <form onSubmit={handleDuplicate} className="space-y-4">
        <div>
          <InputLabel>Story ID</InputLabel>
          <Input
            disabled={loading}
            onChange={e => setStoryIdInput(e.target.value)}
            placeholder="Enter the story ID you want to duplicate..."
            type="text"
            value={storyIdInput}
          />
          <p className="text-sm text-slate-500 mt-2">
            Enter the ID of the story you want to duplicate. All steps and content will be copied to a new story.
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            disabled={loading || !storyIdInput.trim()}
            type="submit"
            variant="primary"
          >
            {loading ? 'Duplicating...' : 'Duplicate Story'}
          </Button>
        </div>
      </form>
    </div>
  )
}
