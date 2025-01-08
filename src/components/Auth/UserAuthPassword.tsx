'use client'
import { FormEvent, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from '@/src/lib/toast'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import { Input } from '../Elements/Input'
import { Button } from '../Elements/Button'

interface UserAuthPasswordProps {
  mode?: 'Signup' | 'Login'
  onSubmit?: (data: { email: string; password: string }) => void
  resetForm?: boolean
}

export function UserAuthPassword({
  mode,
  onSubmit,
  resetForm,
}: UserAuthPasswordProps) {
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

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!result || !result.ok) {
        const errorMessage =
          result?.status === 401
            ? t('wrongPassword')
            : result?.error || t('signin_fail')

        return toast({
          title: t('something_wrong'),
          message: errorMessage,
          type: 'error',
        })
      }

      router.push('/storylab')
      return toast({
        title: t('loginSuccess'),
        message: t('loginSuccessText'),
        type: 'success',
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t('unexpectedError')
      return toast({
        title: t('something_wrong'),
        message: errorMessage,
        type: 'error',
      })
    }
  }

  return (
    <form className="" onSubmit={handleSubmit}>
      <div>
        <Input
          label={t('email')}
          onChange={e => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div>
        <Input
          label={t('password')}
          onChange={e => setPassword(e.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <div className="mt-1 text-right">
        <a
          className="text-sm text-gray-600 hover:underline"
          href="/passwordReset"
        >
          {t('forgotPassword')}
        </a>
      </div>
      <Button className="mt-4 w-full" type="submit">
        {t('login')}
      </Button>
    </form>
  )
}

export default UserAuthPassword
