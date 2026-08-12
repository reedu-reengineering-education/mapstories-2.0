import { useCallback, useEffect, useState } from 'react'

export interface PublicStory {
  id: string
  name: string | null
}

interface UsePublicStoriesReturn {
  stories: PublicStory[]
  loading: boolean
  filteredStories: PublicStory[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  fetchStories: () => Promise<void>
}

export default function usePublicStories(): UsePublicStoriesReturn {
  const [stories, setStories] = useState<PublicStory[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchStories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/public-stories')
      if (!response.ok) {
        throw new Error('Failed to fetch public stories')
      }
      const data = await response.json()
      setStories(data.stories)
    } catch (error) {
      console.error('Error fetching public stories:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const filteredStories = stories.filter(story => {
    const query = searchQuery.toLowerCase()
    const name = (story.name || '').toLowerCase()
    const id = story.id.toLowerCase()
    return name.includes(query) || id.includes(query)
  })

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  return {
    stories,
    loading,
    filteredStories,
    searchQuery,
    setSearchQuery,
    fetchStories,
  }
}
