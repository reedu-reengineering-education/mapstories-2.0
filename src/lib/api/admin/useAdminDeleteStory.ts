import { useState, useCallback } from 'react'
import { toast } from '@/src/lib/toast'

interface DeleteResponse {
  success: boolean
  message: string
  storyId: string
}

export const useAdminDeleteStory = () => {
  const [loading, setLoading] = useState(false)

  const deleteStory = useCallback(async (storyId: string) => {
    if (!storyId.trim()) {
      toast({
        title: 'Error',
        message: 'Please enter a valid story ID',
        type: 'error',
      })
      return null
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/delete-story', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      })

      const data = (await response.json()) as DeleteResponse | { error: string }

      if (!response.ok) {
        const errorMsg = 'error' in data ? data.error : 'Unknown error'
        toast({
          title: 'Deletion failed',
          message: errorMsg,
          type: 'error',
        })
        return null
      }

      if ('success' in data && data.success) {
        toast({
          title: 'Success',
          message: data.message,
          type: 'success',
        })
        return data
      }
    } catch (error) {
      toast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete story',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }

    return null
  }, [])

  return { loading, deleteStory }
}
