'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'

export default function CopyModal({ storyId }: { storyId: string }) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, ['settingsModal'])

  const [modalOpen, setModalOpen] = useState(false)

  const link = `${window.location.origin}/gallery/story/${storyId}/start`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(link)
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
        show={modalOpen}
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
            <Button onClick={() => setModalOpen(false)}>
              {t('settingsModal:copy')}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
