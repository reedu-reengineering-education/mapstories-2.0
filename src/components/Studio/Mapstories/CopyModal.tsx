'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { toast } from '@/src/lib/toast'

export default function CopyModal({ storyId }: { storyId: string }) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, ['settingsModal'])

  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const link = `${window.location.origin}/gallery/story/${storyId}/start`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(link)
  }
  const duplicateStory = async () => {
    try {
      setLoading(true)

      const mapstoryCopy = await fetch(`/api/mapstory/${storyId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const mapstoryCopyJson = await mapstoryCopy.json()

      const newMappstory = await fetch(`/api/mapstory/${mapstoryCopyJson.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      toast({
        title: t('settingsModal:copied'),
        message: t('settingsModal:copiedMessage'),
        type: 'success',
      })
    } catch (e) {
      toast({
        title: t('settingsModal:somethingWrong'),
        message: t('settingsModal:somethingWrong'),
        type: 'error',
      })
    }
    setLoading(false)
  }

  return (
    <>
      <Button
        className=""
        onClick={() => setModalOpen(true)}
        startIcon={<DocumentDuplicateIcon className="w-5" />}
        variant={'inverse'}
      >
        {t('settingsModal:copy')}
      </Button>
      <Modal
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        title={t('settingsModal:copy')}
      >
        <Modal.Content>
          <p className="pb-4 pt-2">{t('settingsModal:youWantCopy')}</p>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex flex-row justify-between">
            <Button onClick={() => setModalOpen(false)} variant={'inverse'}>
              {t('settingsModal:cancel')}
            </Button>
            <Button disabled={loading} onClick={() => duplicateStory()}>
              {loading ? t('settingsModal:copying') : t('settingsModal:copy')}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
