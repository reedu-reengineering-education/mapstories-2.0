'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { CodeBracketIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
// import { useUIStore } from '@/src/lib/store/ui'
// import { useS3Upload } from "next-s3-upload";

export default function EmbedModal({ storyId }: { storyId: string }) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, ['settingsModal', 'studio'])

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Button
        className="re-basic-box"
        onClick={() => setModalOpen(true)}
        startIcon={<CodeBracketIcon className="w-5" />}
        variant={'inverse'}
      >
        {t('settingsModal:embed')}
      </Button>
      <Modal
        onClose={() => setModalOpen(false)}
        show={modalOpen}
        title={t('settingsModal:embed')}
      >
        <Modal.Content></Modal.Content>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  )
}
