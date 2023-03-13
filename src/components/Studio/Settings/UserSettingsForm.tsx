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
import {
  userEmailSchema,
  userNameSchema,
  userUpdateSchema,
} from '@/src/lib/validations/user'
import { Input } from '@/src/components/Elements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import DeleteAccountModal from './DeleteAccountModal'
import { useState } from 'react'
// import EnterPasswordModal from './EnterPasswordModal'

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, 'id'> & {
    name?: string | null
    email?: string | null
  }
}

type FormData = z.infer<typeof userNameSchema> & z.infer<typeof userEmailSchema>

export function UserSettingsForm({
  user,
  className,
  ...props
}: UserNameFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name ?? '',
    },
  })
  const [isSavingName, setIsSavingName] = useState(false)
  const [isSavingEmail, setIsSavingEmail] = useState(false)
  const [isSavingAccount, setIsSavingAccount] = useState(false)

  async function onSubmitName(data: FormData) {
    setIsSavingName(true)

    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
      }),
    })

    setIsSavingName(false)

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your name was not updated. Please try again.',
        type: 'error',
      })
    }

    toast({
      message: 'Your name has been updated.',
      type: 'success',
    })

    router.refresh()
  }

  async function onEmailSubmit(data: FormData) {
    setIsSavingEmail(true)

    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
      }),
    })

    setIsSavingEmail(false)

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your email was not updated. Please try again.',
        type: 'error',
      })
    }

    toast({
      message: 'Your email has been updated.',
      type: 'success',
    })

    router.refresh()
  }

  async function deleteAccount() {
    setIsSavingAccount(true)

    const response = await fetch(`/api/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    setIsSavingAccount(false)

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

    router.push('/register')
  }

  return (
    <>
      <form
        className={cx(className)}
        onSubmit={handleSubmit(onSubmitName)}
        {...props}
      >
        <Card>
          <Card.Header>
            <Card.Title>Name</Card.Title>
            <Card.Description>
              Hier kannst du deinen Namen ändern
            </Card.Description>
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
            <Button
              disabled={isSavingName}
              isLoading={isSavingName}
              type="submit"
            >
              Speichern
            </Button>
          </Card.Footer>
        </Card>
      </form>
      <form
        className={cx(className)}
        onSubmit={handleSubmit(onEmailSubmit)}
        {...props}
      >
        <Card>
          <Card.Header>
            <Card.Title>Email</Card.Title>
            <Card.Description>
              Hier kannst du deine Email ändern
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="w-80 max-w-full">
              {/* <Input
                errors={errors.email}
                label="Email"
                placeholder={'Geben Sie hier Ihre aktuelle Email ein'}
                size={100}
                {...register('email')}
              />
              <Input
                errors={errors.email}
                label="Email"
                placeholder={'Wiederholen Sie ihre aktuelle Email Adresse'}
                size={100}
                {...register('email')}
              /> */}
              <Input
                errors={errors.email}
                label="Email"
                placeholder={'Geben Sie hier Ihre neue Email Adresse ein'}
                size={100}
                {...register('email')}
              />
            </div>
          </Card.Content>
          <Card.Footer>
            {/* <EnterPasswordModal
              isSaving={isSaving}
              onSubmit={() => onEmailSubmit}
              trigger={ */}
            {/* TODO: Add EnterPasswordModal when passwords exist */}
            <Button
              disabled={isSavingEmail}
              isLoading={isSavingEmail}
              type="submit"
            >
              Speichern
            </Button>
            {/* }
            /> */}
          </Card.Footer>
        </Card>
      </form>
      <div className="flex justify-center">
        <DeleteAccountModal
          isSaving={isSavingAccount}
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
