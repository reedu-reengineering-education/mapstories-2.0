'use client'

// import { useState } from 'react'
import { Button } from '../../Elements/Button'
import { Modal } from '../../Modal'

type Props = {
  trigger: React.ReactElement
  onSubmit: () => void
  isSaving: boolean
}

export default function DeleteAccountModal({
  trigger,
  onSubmit,
  isSaving,
}: Props) {
  //   const { t } = useTranslation(lng, 'editModal')

  return (
    <Modal title={'Account löschen'} trigger={trigger}>
      <form onSubmit={onSubmit}>
        <Modal.Content>
          <div className="text-center font-bold">
            <p>
              Wenn Sie ihren Account löschen gehen alle ihre Stories verloren!
            </p>
            <br />
            <p className="text-red-600">
              Sind Sie sicher dass Sie ihren Account löschen möchten?
            </p>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex flex-row justify-between">
            <Button
              disabled={isSaving}
              isLoading={isSaving}
              onClick={onSubmit}
              variant={'danger'}
            >
              Ja
            </Button>
            <Button>Abbrechen</Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
