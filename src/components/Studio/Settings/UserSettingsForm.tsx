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
import { userNameSchema } from '@/src/lib/validations/user'
import { Input } from '@/src/components/Elements/Input'
import { zodResolver } from '@hookform/resolvers/zod'

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, 'id'> & {
    name?: string | null
  }
}

type FormData = z.infer<typeof userNameSchema>

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
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user.name ?? '',
    },
  })
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
      }),
    })

    setIsSaving(false)

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

  return (
    <form
      className={cx(className)}
      onSubmit={handleSubmit(onSubmit)}
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
          <Button disabled={isSaving} isLoading={isSaving} type="submit">
            Speichern
          </Button>
        </Card.Footer>
      </Card>
    </form>
  )
}
