'use client'

// import { useState } from 'react'
import { Button } from '../../Elements/Button'
import { Modal } from '../../Modal'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import { useState } from 'react'
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
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { t } = useTranslation(lng, 'editModal')

  const [open, setOpen] = useState(false)

  return (
    <Modal
      onOpenChange={setOpen}
      open={open}
      title={t('deleteAccount')}
      trigger={trigger}
    >
      <form onSubmit={onSubmit}>
        <Modal.Content>
          <div className="text-center font-bold">
            <p>{t('deleteAccountWarning')}</p>
            <br />
            <p className="text-red-600">{t('deleteAccount')}</p>
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
              {t('yes')}
            </Button>
            <Button>{t('cancel')}</Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
