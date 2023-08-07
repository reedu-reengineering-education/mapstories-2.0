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

  // TODO: duplicateStory
  // take story id and duplicate it
  const duplicateStory = async () => {
    const mapstory = await fetch(`/api/mapstory/${storyId}`)
    const mapstoryJson = await mapstory.json()
    console.log(mapstoryJson)

    // create a new story with the name of the old story but with "copy" appended, also copy the description and the steps to the new copy story
    const newStory = await fetch('/api/mapstory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${mapstoryJson.name} (copy)`,
        description: mapstoryJson.description,
      }),
    })
    const newStoryJson = await newStory.json()
    // now add the steps to the new story
    //
    //

    console.log(newStoryJson)
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
            <Button onClick={() => duplicateStory()}>
              {t('settingsModal:copy')}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
