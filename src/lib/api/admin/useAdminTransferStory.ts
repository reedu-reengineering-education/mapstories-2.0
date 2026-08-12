import { useState, useCallback } from 'react'
import { toast } from '@/src/lib/toast'

interface TransferResponse {
  success: boolean
  message: string
  story: {
    id: string
    name: string
    previousOwnerId: string
    newOwnerId: string
  }
}

export const useAdminTransferStory = () => {
  const [loading, setLoading] = useState(false)

  const transferStory = useCallback(
    async (storyId: string, targetUserEmail: string) => {
      if (!storyId.trim()) {
        toast({
          title: 'Error',
          message: 'Please enter a valid story ID',
          type: 'error',
        })
        return null
      }

      if (!targetUserEmail.trim()) {
        toast({
          title: 'Error',
          message: 'Please enter a valid target user email',
          type: 'error',
        })
        return null
      }

      setLoading(true)
      try {
        const response = await fetch('/api/admin/transfer-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storyId, targetUserEmail }),
        })

        const data = (await response.json()) as
          | TransferResponse
          | { error: string }

        if (!response.ok) {
          const errorMsg = 'error' in data ? data.error : 'Unknown error'
          toast({
            title: 'Transfer failed',
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
          message: error instanceof Error ? error.message : 'Failed to transfer story',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }

      return null
    },
    [],
  )

  return { loading, transferStory }
}
