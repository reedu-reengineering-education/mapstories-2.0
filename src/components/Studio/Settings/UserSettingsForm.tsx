'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Elements/Button'
import { Input } from '@/src/components/Elements/Input'
import { cx } from 'class-variance-authority'
import { toast } from '@/src/lib/toast'
import { User } from '@prisma/client'
import { userUpdateSchema } from '@/src/lib/validations/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import ChangePasswordModal from './ChangePasswordModal'
import { Clipboard } from 'lucide-react'

interface UserNameFormProps {
  user: {
    id: string
    name?: string
    email?: string
    password?: string
  }
  className?: string
}

type FormData = {
  name?: string
  email: string
  password?: string
}

export function UserSettingsForm({
  user,
  className,
  ...props
}: UserNameFormProps) {
  const {
    handleSubmit,
    register,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name ?? '',
      email: user.email ?? '',
    },
  })
  const router = useRouter()
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'userSettingsForm')

  const [isSaving, setIsSaving] = useState(false)

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response?.ok) {
        return toast({
          title: t('somethingWrong'),
          message: t('contentNotUpdated'),
          type: 'error',
        })
      }

      const updatedUser: User = await response.json()

      if (user.email !== updatedUser.email) {
        toast({
          message: t('logInAgain'),
          type: 'success',
        })
        signOut({ callbackUrl: '/login' })
        return
      }

      toast({
        title: t('contentUpdated'),
        message: t('contentUpdated'),
        type: 'success',
      })

      router.refresh()
    } catch {
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      className={cx('space-y-6', className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <Card.Header>
          <Card.Title>Benutzer-Einstellungen</Card.Title>
          <Card.Description>
            Hier kannst du deine Daten ändern.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          {/* Name Input */}
          <div className="mb-4">
            <Input
              defaultValue={user.name ?? ''}
              errors={errors.name}
              label="Name"
              {...register('name', { required: 'Name ist erforderlich.' })}
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <Input
              defaultValue={user.email ?? ''}
              errors={errors.email}
              label="E-Mail"
              {...register('email', {
                required: 'E-Mail ist erforderlich.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Bitte eine gültige E-Mail-Adresse eingeben.',
                },
              })}
            />
          </div>

          {/* Checkbox und Passwort-Feld */}
          <div className="mb-4">
            <div className="flex w-full flex-row justify-start gap-4">
              <Input
                disabled={true}
                label="Passwort"
                placeholder="Passwort"
                type="password"
                value={'••••••••'}
              />
              <div>
                <ChangePasswordModal
                  trigger={
                    <Button
                      startIcon={<Clipboard className="h-10"></Clipboard>}
                      variant={'inverse'}
                    >
                      Change Password
                    </Button>
                  }
                  user={user}
                />
              </div>
            </div>
          </div>
        </Card.Content>

        <Card.Footer className="flex justify-end">
          <Button disabled={isSaving} isLoading={isSaving} type="submit">
            Speichern
          </Button>
        </Card.Footer>
      </Card>
    </form>
  )
}

export default UserSettingsForm
