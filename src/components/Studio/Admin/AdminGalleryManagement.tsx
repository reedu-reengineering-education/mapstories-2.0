'use client'

import { useEffect, useState } from 'react'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { Button } from '@/src/components/Elements/Button'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import useAdminGallery from '@/src/lib/api/admin/useAdminGallery'
import usePublicStories from '@/src/lib/api/admin/usePublicStories'
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@/src/components/Tooltip'

export default function AdminGalleryManagement({
  site = 'MAIN',
}: {
  site?: 'MAIN' | 'BFDW'
}) {
  const lng = useBoundStore(state => state.language)
  // @ts-ignore i18next's t return type exceeds the instantiation depth limit
  // (TS2589) with many t() calls; cast to a simple signature.
  const { t: tRaw } = useTranslation(lng, 'admin')
  const t = tRaw as (key: string) => string
  const [storyIdInput, setStoryIdInput] = useState('')
  const [selectedStoryName, setSelectedStoryName] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  
  const {
    galleryStories,
    loading,
    fetchGalleryStories,
    addStoryToGallery,
    removeStoryFromGallery,
    reorderGalleryStories,
  } = useAdminGallery(site)

  const {
    filteredStories,
    searchQuery,
    setSearchQuery,
  } = usePublicStories(site)

  useEffect(() => {
    fetchGalleryStories()
  }, [fetchGalleryStories])

  const handleSelectStory = async (storyId: string, storyName: string | null) => {
    setStoryIdInput(storyId)
    setSelectedStoryName(storyName)
    setShowDropdown(false)
    setSearchQuery('')
  }

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storyIdInput.trim()) {
      toast({
        title: 'Error',
        message: t('admin:selectAStory') || 'Please select a story',
        type: 'error',
      })
      return
    }

    await addStoryToGallery(storyIdInput)
    setStoryIdInput('')
    setSelectedStoryName(null)
    setSearchQuery('')
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
    if (!draggedItem) {return}

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
        
        <form className="flex gap-2" onSubmit={handleAddStory}>
          <div className="flex-1 relative">
            <InputLabel>{t('admin:selectStory')}</InputLabel>
            
            {storyIdInput ? (
              /* Selected Story Display */
              <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-indigo-900 truncate">
                    {selectedStoryName || t('admin:untitled')}
                  </p>
                  <p className="text-sm text-indigo-600 truncate">
                    {storyIdInput}
                  </p>
                </div>
                <button
                  className="flex-shrink-0 px-3 py-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded transition text-sm font-medium"
                  onClick={() => {
                    setStoryIdInput('')
                    setSelectedStoryName(null)
                    setSearchQuery('')
                  }}
                  type="button"
                >
                  {t('admin:deselect') || 'Clear'}
                </button>
              </div>
            ) : (
              /* Search Input */
              <>
                <Input
                  disabled={loading}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  onChange={e => {
                    setSearchQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={t('admin:searchStories') || 'Search by name or ID...'}
                  type="text"
                  value={searchQuery}
                />
                
                {/* Autocomplete Dropdown */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {filteredStories.length === 0 ? (
                      <div className="p-3 text-sm text-slate-500 text-center">
                        {t('admin:noStoriesFound') || 'No stories found'}
                      </div>
                    ) : (
                      filteredStories.map(story => (
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-slate-100 border-b border-slate-100 last:border-b-0 transition flex justify-between items-start"
                          key={story.id}
                          onClick={() => handleSelectStory(story.id, story.name)}
                          type="button"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {story.name || t('admin:untitled')}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {story.id}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex items-end">
            <Button
              disabled={loading || !storyIdInput.trim()}
              type="submit"
              variant="primary"
            >
              {loading ? t('admin:adding') || 'Adding...' : t('admin:add') || 'Add'}
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
                className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                  draggedItem === galleryStory.id
                    ? 'bg-slate-50 border-slate-300 opacity-50'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
                draggable
                key={galleryStory.id}
                onDragOver={handleDragOver}
                onDragStart={e => handleDragStart(e, galleryStory.id)}
                onDrop={e => handleDrop(e, galleryStory.id)}
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
                    className="flex-shrink-0 p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                    disabled={loading}
                    onClick={() => handleRemoveStory(galleryStory.id)}
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
