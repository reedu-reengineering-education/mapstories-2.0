'use client'

import { useState, useEffect } from 'react'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { Button } from '@/src/components/Elements/Button'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import useAdminGallery from '@/src/lib/api/admin/useAdminGallery'
import { TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@/src/components/Tooltip'

export default function AdminGalleryManagement() {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'admin')
  const [storyIdInput, setStoryIdInput] = useState('')
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  
  const {
    galleryStories,
    loading,
    fetchGalleryStories,
    addStoryToGallery,
    removeStoryFromGallery,
    reorderGalleryStories,
  } = useAdminGallery()

  useEffect(() => {
    fetchGalleryStories()
  }, [fetchGalleryStories])

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storyIdInput.trim()) {
      toast({
        title: 'Error',
        message: 'Please enter a story ID',
        type: 'error',
      })
      return
    }

    await addStoryToGallery(storyIdInput)
    setStoryIdInput('')
    await fetchGalleryStories()
  }

  const handleRemoveStory = async (galleryStoryId: string) => {
    await removeStoryFromGallery(galleryStoryId)
  }

  const handleDragStart = (e: React.DragEvent, galleryStoryId: string) => {
    setDraggedItem(galleryStoryId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (
    e: React.DragEvent,
    targetGalleryStoryId: string,
  ) => {
    e.preventDefault()
    if (!draggedItem) return

    const draggedIndex = galleryStories.findIndex(gs => gs.id === draggedItem)
    const targetIndex = galleryStories.findIndex(
      gs => gs.id === targetGalleryStoryId,
    )

    if (draggedIndex === targetIndex) {
      setDraggedItem(null)
      return
    }

    const newStories = [...galleryStories]
    const [draggedStory] = newStories.splice(draggedIndex, 1)
    newStories.splice(targetIndex, 0, draggedStory)

    const newOrder = newStories.map(gs => gs.id)
    await reorderGalleryStories(newOrder)
    setDraggedItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Add Story Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          {t('admin:addStoryToGallery')}
        </h3>
        
        <form onSubmit={handleAddStory} className="flex gap-2">
          <div className="flex-1">
            <InputLabel>{t('admin:storyId')}</InputLabel>
            <Input
              type="text"
              placeholder="Enter story ID..."
              value={storyIdInput}
              onChange={e => setStoryIdInput(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              disabled={loading || !storyIdInput.trim()}
              variant="primary"
            >
              {loading ? 'Adding...' : 'Add to Gallery'}
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-slate-500 mt-2">
          {t('admin:storyMustBePublic')}
        </p>
      </div>

      {/* Gallery Stories List */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          {t('admin:galleryStories')}
        </h3>

        {galleryStories.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            {t('admin:noStoriesInGallery')}
          </p>
        ) : (
          <div className="space-y-2">
            {galleryStories.map((galleryStory, index) => (
              <div
                key={galleryStory.id}
                draggable
                onDragStart={e => handleDragStart(e, galleryStory.id)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, galleryStory.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                  draggedItem === galleryStory.id
                    ? 'bg-slate-50 border-slate-300 opacity-50'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Drag Handle */}
                <Tooltip content="Drag to reorder" side="right">
                  <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-400">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </div>
                </Tooltip>

                {/* Position Badge */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                  {index + 1}
                </div>

                {/* Story Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {galleryStory.story?.name || 'Untitled'}
                  </p>
                  <p className="text-xs text-slate-500">
                    ID: {galleryStory.storyId}
                  </p>
                </div>

                {/* Delete Button */}
                <Tooltip content="Remove from gallery" side="left">
                  <button
                    onClick={() => handleRemoveStory(galleryStory.id)}
                    disabled={loading}
                    className="flex-shrink-0 p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
