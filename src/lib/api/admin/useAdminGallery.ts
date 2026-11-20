import { useCallback, useState } from 'react'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'

interface GalleryStory {
  id: string
  storyId: string
  position: number
  story: any
  createdAt: string
  updatedAt: string
}

interface UseAdminGalleryReturn {
  galleryStories: GalleryStory[]
  loading: boolean
  fetchGalleryStories: () => Promise<void>
  addStoryToGallery: (storyId: string) => Promise<void>
  removeStoryFromGallery: (galleryStoryId: string) => Promise<void>
  reorderGalleryStories: (storyIds: string[]) => Promise<void>
}

export default function useAdminGallery(site: 'MAIN' | 'BFDW' = 'MAIN'): UseAdminGalleryReturn {
  const [galleryStories, setGalleryStories] = useState<GalleryStory[]>([])
  const [loading, setLoading] = useState(false)
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'admin')

  const fetchGalleryStories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/gallery?site=${site}`)
      if (!response.ok) {throw new Error('Failed to fetch gallery stories')}
      const data = await response.json()
      setGalleryStories(data.stories)
    } catch (error) {
      console.error('Error fetching gallery stories:', error)
      toast({
        title: t('error'),
        message: t('fetchGalleryError'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [site, t])

  const addStoryToGallery = useCallback(async (storyId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, site }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t('galleryAddError'))
      }

      const data = await response.json()
      setGalleryStories(prev => [...prev, data.galleryStory])

      toast({
        title: t('success'),
        message: t('galleryStoryAdded'),
        type: 'success',
      })
    } catch (error: any) {
      console.error('Error adding story to gallery:', error)
      toast({
        title: t('error'),
        message: error.message || t('galleryAddError'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [t])

  const removeStoryFromGallery = useCallback(async (galleryStoryId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryStoryId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove story from gallery')
      }

      setGalleryStories(prev => prev.filter(gs => gs.id !== galleryStoryId))

      toast({
        title: t('success'),
        message: t('galleryStoryRemoved'),
        type: 'success',
      })
    } catch (error) {
      console.error('Error removing story from gallery:', error)
      toast({
        title: t('error'),
        message: t('galleryRemoveError'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [t])

  const reorderGalleryStories = useCallback(async (storyIds: string[]) => {
    try {
      const response = await fetch('/api/admin/gallery/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryStoryIds: storyIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to reorder gallery stories')
      }

      // Reorder locally
      const orderedStories = storyIds.map(id =>
        galleryStories.find(gs => gs.id === id),
      ).filter(Boolean) as GalleryStory[]

      setGalleryStories(orderedStories)
    } catch (error) {
      console.error('Error reordering gallery stories:', error)
      toast({
        title: t('error'),
        message: t('galleryReorderError'),
        type: 'error',
      })
    }
  }, [galleryStories, t])

  return {
    galleryStories,
    loading,
    fetchGalleryStories,
    addStoryToGallery,
    removeStoryFromGallery,
    reorderGalleryStories,
  }
}
