'use client'
import { FormEvent, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from '@/src/lib/toast'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'

interface UserAuthPasswordProps {
  mode: 'Signup' | 'Login'
  onSubmit: (data: { email: string; password: string }) => void
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

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Verhindert automatische Weiterleitung
    })
    if (!result?.ok) {
      return toast({
        title: t('something_wrong'),
        message: t('signin_fail'),
        type: 'error',
      })
    }

    router.push('/storylab')
    return toast({
      title: t('loginSuccess'),
      message: t('loginSuccessText'),
      type: 'success',
    })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="mb-4 text-center text-2xl font-bold">{mode}</h2>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Email</label>
        <input
          className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          onChange={e => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          onChange={e => setPassword(e.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <button
        className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        type="submit"
      >
        Passwort Login
      </button>
    </form>
  )
}
export default UserAuthPassword
