'use client'

import * as React from 'react'
import { User } from '@prisma/client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from '@/src/lib/toast'
import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Elements/Button'
import { cx } from 'class-variance-authority'
import { userUpdateSchema } from '@/src/lib/validations/user'
import { Input } from '@/src/components/Elements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from '@/src/app/i18n/client'
import { useUIStore } from '@/src/lib/store/ui'

import DeleteAccountModal from './DeleteAccountModal'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, 'id'> & Partial<Pick<User, 'name' | 'email'>>
}

type FormData = z.infer<typeof userUpdateSchema>

export function UserSettingsForm({
  user,
  className,
  ...props
}: UserNameFormProps) {
  const router = useRouter()
  const lng = useUIStore(state => state.language)
  const { t } = useTranslation(lng, 'userSettingsForm')

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
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function onSubmit(data: FormData) {
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
          title: 'Something went wrong.',
          message: 'Your account was not updated. Please try again.',
          type: 'error',
        })
      }

      const updatedUser: User = await response.json()

      if (user.email !== updatedUser.email) {
        toast({
          message: 'Please log in again to update your email',
          type: 'success',
        })
        signOut({ callbackUrl: '/login' })
        return
      }

      toast({
        message: 'Your account has been updated.',
        type: 'success',
      })

      router.refresh()
    } catch {
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteAccount() {
    setIsDeleting(true)

    const response = await fetch(`/api/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your account was not deleted. Please try again.',
        type: 'error',
      })
    }

    toast({
      message: 'Your account was deleted successfully.',
      type: 'success',
    })

    setIsDeleting(false)

    router.push('/register')
  }

  return (
    <>
      <form
        className={cx(className)}
        onSubmit={handleSubmit(onSubmit)}
        {...props}
      >
        <Card>
          <Card.Header>
            <Card.Title>{t('name')}</Card.Title>
            <Card.Description>{t('change your name here')}</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="w-80 max-w-full">
              <Input
                defaultValue={user.name ?? ''}
                errors={errors.name}
                label="Name"
                size={32}
                {...register('name')}
              />
            </div>
          </Card.Content>
          <Card.Footer>
            <Button disabled={isSaving} isLoading={isSaving} type="submit">
              {t('save')}
            </Button>
          </Card.Footer>
        </Card>
      </form>
      <div className="flex justify-center">
        <DeleteAccountModal
          isSaving={isDeleting}
          onSubmit={deleteAccount}
          trigger={
            <Button className="my-2" variant={'danger'}>
              Account löschen
            </Button>
          }
        />
      </div>
    </>
  )
}
