import { useCallback, useState } from 'react'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'

interface DeleteResponse {
  success: boolean
  message: string
  storyId: string
}

export const useAdminDeleteStory = () => {
  const [loading, setLoading] = useState(false)
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'admin')

  const deleteStory = useCallback(async (storyId: string) => {
    if (!storyId.trim()) {
      toast({
        title: t('error'),
        message: t('invalidStoryId'),
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
        const errorMsg = 'error' in data ? data.error : t('unknownError')
        toast({
          title: t('deletionFailed'),
          message: errorMsg,
          type: 'error',
        })
        return null
      }

      if ('success' in data && data.success) {
        toast({
          title: t('success'),
          message: data.message,
          type: 'success',
        })
        return data
      }
    } catch (error) {
      toast({
        title: t('error'),
        message: t('deleteStoryError'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }

    return null
  }, [t])

  return { loading, deleteStory }
}
