import { useCallback, useState } from 'react'
import { toast } from '@/src/lib/toast'

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

export default function useAdminGallery(): UseAdminGalleryReturn {
  const [galleryStories, setGalleryStories] = useState<GalleryStory[]>([])
  const [loading, setLoading] = useState(false)

  const fetchGalleryStories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery')
      if (!response.ok) throw new Error('Failed to fetch gallery stories')
      const data = await response.json()
      setGalleryStories(data.stories)
    } catch (error) {
      console.error('Error fetching gallery stories:', error)
      toast({
        title: 'Error',
        message: 'Failed to fetch gallery stories',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const addStoryToGallery = useCallback(async (storyId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add story to gallery')
      }

      const data = await response.json()
      setGalleryStories(prev => [...prev, data.galleryStory])

      toast({
        title: 'Success',
        message: 'Story added to gallery',
        type: 'success',
      })
    } catch (error: any) {
      console.error('Error adding story to gallery:', error)
      toast({
        title: 'Error',
        message: error.message || 'Failed to add story to gallery',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [])

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
        title: 'Success',
        message: 'Story removed from gallery',
        type: 'success',
      })
    } catch (error) {
      console.error('Error removing story from gallery:', error)
      toast({
        title: 'Error',
        message: 'Failed to remove story from gallery',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [])

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
        title: 'Error',
        message: 'Failed to reorder gallery stories',
        type: 'error',
      })
    }
  }, [galleryStories])

  return {
    galleryStories,
    loading,
    fetchGalleryStories,
    addStoryToGallery,
    removeStoryFromGallery,
    reorderGalleryStories,
  }
}
