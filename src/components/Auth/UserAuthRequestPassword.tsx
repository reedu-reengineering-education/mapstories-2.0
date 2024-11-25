'use client'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import { Input } from '../Elements/Input'
import { Button } from '../Elements/Button'
import { toast } from '@/src/lib/toast'

interface UserAuthRequestPasswordProps {
  mode?: 'Signup' | 'Login'
  onSubmit?: (data: { email: string; password: string }) => void
  resetForm?: boolean
}
export function UserAuthRequestPassword({
  mode,
  onSubmit,
  resetForm,
}: UserAuthRequestPasswordProps) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  useEffect(() => {
    if (resetForm) {
      setEmail('')
      setPassword('')
    }
  }, [resetForm])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = await fetch('/api/users/requestPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (result.status !== 200) {
      return toast({
        title: t('something_wrong'),
        message: t('signin_fail'),
        type: 'error',
      })
    }

    toast({
      title: 'Mail send',
      message: 'Check your email for the new password',
      type: 'success',
    })
  }

  return (
    <form className="" onSubmit={handleSubmit}>
      <h2 className="mb-4 text-center text-2xl font-bold">{mode}</h2>
      <Input
        label="Email"
        onChange={e => setEmail(e.target.value)}
        required
        type="email"
        value={email}
      />

      <Button className="w-full" type="submit">
        {' '}
        Request Password
      </Button>
    </form>
  )
}
export default UserAuthRequestPassword
