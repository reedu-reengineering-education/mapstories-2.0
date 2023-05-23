'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { ShareIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
// import { useUIStore } from '@/src/lib/store/ui'
// import { useS3Upload } from "next-s3-upload";

export default function ShareModal({ storyId }: { storyId: string }) {
  const router = useRouter()
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, ['settingsModal', 'studio'])

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Button
        className="re-basic-box"
        onClick={() => setModalOpen(true)}
        startIcon={<ShareIcon className="w-5" />}
        variant={'inverse'}
      >
        {t('settingsModal:share')}
      </Button>
      <Modal
        onClose={() => setModalOpen(false)}
        show={modalOpen}
        title={t('settingsModal:share')}
      >
        <Modal.Content></Modal.Content>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  )
}
