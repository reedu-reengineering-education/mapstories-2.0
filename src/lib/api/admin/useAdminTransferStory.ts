import { useCallback, useState } from 'react'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'

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
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'admin')

  const transferStory = useCallback(
    async (storyId: string, targetUserEmail: string) => {
      if (!storyId.trim()) {
        toast({
          title: t('error'),
          message: t('invalidStoryId'),
          type: 'error',
        })
        return null
      }

      if (!targetUserEmail.trim()) {
        toast({
          title: t('error'),
          message: t('invalidTargetEmail'),
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
          const errorMsg = 'error' in data ? data.error : t('unknownError')
          toast({
            title: t('transferFailed'),
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
          message: t('transferStoryError'),
          type: 'error',
        })
      } finally {
        setLoading(false)
      }

      return null
    },
    [t],
  )

  return { loading, transferStory }
}
