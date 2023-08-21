'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { CodeBracketIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import AnimatedCopyIcon from '../../Icons/AnimatedCopyIcon'
// import { useUIStore } from '@/src/lib/store/ui'
// import { useS3Upload } from "next-s3-upload";

export default function EmbedModal({ storyId }: { storyId: string }) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, ['settingsModal'])

  const [open, setOpen] = useState(false)

  const link = `${window.location.origin}/gallery/all/story/${storyId}/start`

  const iframeSrc = `<iframe src="${link}" style="border:none; width:100%; height:100%" title="Mapstories"></iframe>`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(iframeSrc)
  }

  return (
    <>
      <Modal
        onOpenChange={setOpen}
        open={open}
        title={t('settingsModal:embed')}
        trigger={
          <Button
            className=""
            startIcon={<CodeBracketIcon className="w-5" />}
            variant={'inverse'}
          >
            {t('settingsModal:embed')}
          </Button>
        }
      >
        <Modal.Content>
          <p className="pb-4 pt-2">{t('settingsModal:you_want_to_embed')}</p>

          <div className="flex rounded bg-slate-100 p-4">
            <pre className="m-4 flex-1 whitespace-pre-wrap break-all text-sm">
              {iframeSrc}
            </pre>
            <div className="relative w-7">
              <AnimatedCopyIcon onClick={copyToClipboard} />
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer
          close={
            <div className="flex justify-end">
              <Button>Ok</Button>
            </div>
          }
        />
      </Modal>
    </>
  )
}
