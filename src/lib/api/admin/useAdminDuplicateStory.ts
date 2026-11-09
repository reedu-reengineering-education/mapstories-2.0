import { useCallback, useState } from 'react'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'

interface DuplicateResponse {
  success: boolean
  message: string
  storyId: string
  slug: string
}

export const useAdminDuplicateStory = () => {
  const [loading, setLoading] = useState(false)
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'admin')

  const duplicateStory = useCallback(async (storyId: string) => {
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
      const response = await fetch('/api/admin/duplicate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      })

      const data = (await response.json()) as DuplicateResponse | { error: string }

      if (!response.ok) {
        const errorMsg = 'error' in data ? data.error : t('unknownError')
        toast({
          title: t('duplicationFailed'),
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
        message: t('duplicateStoryError'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }

    return null
  }, [t])

  return { loading, duplicateStory }
}
