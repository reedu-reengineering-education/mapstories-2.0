'use client'
import { useState, FormEvent, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'

interface UserAuthPasswordProps {
  mode: 'Signup' | 'Login'
  onSubmit: (data: { email: string; password: string }) => void
  resetForm?: boolean
}
const UserAuthPassword: React.FC<UserAuthPasswordProps> = ({
  mode,
  onSubmit,
  resetForm,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  useEffect(() => {
    if (resetForm) {
      setEmail('')
      setPassword('')
    }
  }, [resetForm])
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    signIn('credentials', { email, password })
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="mb-4 text-center text-2xl font-bold">{mode}</h2>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Passwort Login
      </button>
    </form>
  )
}
export default UserAuthPassword
