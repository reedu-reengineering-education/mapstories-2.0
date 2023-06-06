'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { ShareIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import AnimatedCopyIcon from '../../Icons/AnimatedCopyIcon'

export default function ShareModal({ storyId }: { storyId: string }) {
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
        <Modal.Content>
          <p className="pb-4 pt-2">{t('settingsModal:you_want_to_share')}</p>
          <div className="flex rounded bg-slate-100 p-4">
            <pre className="m-4 flex-1 whitespace-pre-wrap break-all text-sm">
              {link}
            </pre>
            <div className="relative w-7">
              <AnimatedCopyIcon onClick={copyToClipboard} />
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex justify-end">
            <Button onClick={() => setModalOpen(false)}>Ok</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
