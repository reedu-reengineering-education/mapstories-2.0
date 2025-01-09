'use client'
import React, { useState } from 'react'
import { Input } from '../Elements/Input'
import { Button } from '../Elements/Button'
import { toast } from '@/src/lib/toast'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'

export default function UserResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'login')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Handle password reset logic here
    // Validate email before making the request
    if (!validateEmail(email)) {
      setError(t('invalidEmail'))
      return
    }

    setError('')

    const response = await fetch('/api/users/resetPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(res => res.json())
      .then(data => {
        toast({
          title: t('resetPassword'),
          message: t('resetPasswordMessage'),
          type: 'success',
        })
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  return (
    <div className="w-full">
      <Input
        className="w-full"
        label="Email"
        onChange={e => setEmail(e.target.value)}
        type="email"
        value={email}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <Button className="mt-4 w-full" onClick={handleSubmit} type="submit">
        {t('submitPasswordReset')}
      </Button>
    </div>
  )
}
