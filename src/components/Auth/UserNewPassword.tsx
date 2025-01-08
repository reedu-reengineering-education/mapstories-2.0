'use client'
import React, { useState } from 'react'
import { Input } from '../Elements/Input'
import { Button } from '../Elements/Button'
import { toast } from '@/src/lib/toast'
import { useRouter } from 'next/navigation'

export default function UserNewPassword({ token }: { token: string }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Validate that passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    // Handle password reset logic here
    setError('') // Clear error message if passwords match
    const response = await fetch('/api/users/newPasswordFromReset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    })
      .then(res => res.json())
      .then(data => {
        toast({
          title: 'Password reset',
          message:
            'Your password has been changed. You can now login with your new password.',
          type: 'success',
        })
        router.push('/login')
      })
      .catch(error => {
        toast({
          title: 'Error',
          message:
            error.message || 'An error occurred while resetting your password.',
          type: 'error',
        })
      })
  }

  return (
    <div className="w-full">
      <Input
        className="mt-2 w-full"
        label="New Password"
        onChange={e => setPassword(e.target.value)}
        type="password"
        value={password}
      />
      <Input
        className="mt-2 w-full"
        label="Confirm Password"
        onChange={e => setConfirmPassword(e.target.value)}
        type="password"
        value={confirmPassword}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <Button className="mt-4 w-full" onClick={handleSubmit} type="submit">
        Passwort zurücksetzen
      </Button>
    </div>
  )
}
