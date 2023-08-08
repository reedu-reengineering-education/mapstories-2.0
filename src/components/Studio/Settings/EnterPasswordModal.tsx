'use client'

// import { useState } from 'react'
import { Button } from '../../Elements/Button'
import { Modal } from '../../Modal'
import { useForm } from 'react-hook-form'
import { Input } from '../../Elements/Input'
import { useState } from 'react'

type Props = {
  trigger: React.ReactElement
  onSubmit: () => void
  isSaving: boolean
}

export default function EnterPasswordModal({
  trigger,
  onSubmit,
  isSaving,
}: Props) {
  //   const { t } = useTranslation(lng, 'editModal')

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    // resolver: zodResolver(createMapstorySchema),
  })

  const [open, setOpen] = useState(false)

  return (
    <Modal
      onOpenChange={setOpen}
      open={open}
      title={'Passwort eingeben'}
      trigger={trigger}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content>
          <Input label="Passwort" />
        </Modal.Content>
        <Modal.Footer>
          <Button disabled={isSaving} isLoading={isSaving} onClick={onSubmit}>
            Senden
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
