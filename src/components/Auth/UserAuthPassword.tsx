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
        redirect: false, // Verhindert automatische Weiterleitung
      })

      if (!result || !result.ok) {
        const errorMessage =
          result?.status === 401
            ? t('wrongPassword') // Spezifische Meldung für 401
            : result?.error || t('signin_fail') // Standard-Fehlermeldung oder Nachricht aus der HTTP-Antwort

        return toast({
          title: t('something_wrong'),
          message: errorMessage,
          type: 'error',
        })
      }

      // Erfolg: Weiterleitung
      router.push('/storylab')
      return toast({
        title: t('loginSuccess'),
        message: t('loginSuccessText'),
        type: 'success',
      })
    } catch (error: any) {
      // Fallback für unerwartete Fehler
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
      <h2 className="mb-4 text-center text-2xl font-bold">{mode}</h2>
      <div>
        <Input
          label="Email"
          onChange={e => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div>
        <Input
          label="Password"
          onChange={e => setPassword(e.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <Button className="w-full" type="submit">
        {' '}
        Login
      </Button>
    </form>
  )
}
export default UserAuthPassword
