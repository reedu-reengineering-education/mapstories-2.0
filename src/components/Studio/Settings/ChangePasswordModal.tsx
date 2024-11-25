'use client'

import { useState } from 'react'

import { Modal } from '../../Modal'
import { Input, InputLabel } from '../../Elements/Input'
import { Button } from '../../Elements/Button'
import { toast } from '@/src/lib/toast'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'

type Props = {
  trigger: React.ReactElement
  user: {
    id: string
    name?: string
    email?: string
    password?: string
    passwordEnabled?: boolean
  }
}

export default function ChangePasswordModal({ trigger, user }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [passwordnew, setPasswordNew] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'userSettingsForm')

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordnew }),
      })

      if (!response?.ok) {
        return toast({
          title: t('somethingWrong'),
          message: t('contentNotUpdated'),
          type: 'error',
        })
      }

      toast({
        title: t('contentUpdated'),
        message: t('contentUpdated'),
        type: 'success',
      })
      setIsOpen(false)
    } catch {}
  }

  return (
    <>
      <Modal
        onOpenChange={setIsOpen}
        open={isOpen}
        title="Change Password"
        trigger={trigger}
      >
        <Modal.Content className="flex flex-col gap-4">
          <div>
            Change the password for <strong>{user.name}</strong>
          </div>
          <div className="flex items-center gap-4">
            <InputLabel className="w-1/4 text-right">New Password</InputLabel>
            <Input
              className="flex-1"
              id="password"
              onChange={e => setPasswordNew(e.target.value)}
              required
              type="password"
            />
          </div>
          <div className="flex items-center gap-4">
            <InputLabel className="w-1/4 text-right">
              Confirm Password
            </InputLabel>
            <Input
              className="flex-1"
              onChange={e => setConfirmPassword(e.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </div>

          <div className="flex justify-end">
            <Button
              disabled={confirmPassword !== passwordnew}
              onClick={() => handleSubmit()}
            >
              Change Password
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}
