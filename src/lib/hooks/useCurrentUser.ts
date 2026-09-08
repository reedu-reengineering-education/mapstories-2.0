'use client'

import { useEffect, useState } from 'react'

interface User {
  email?: string | null
  role?: 'ADMIN' | 'SITE_ADMIN_BFDW' | 'USER'
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userResponse = await fetch('/api/auth/currentuser')
        if (!userResponse.ok) {
          setLoading(false)
          return
        }
        const userData = await userResponse.json()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isBfdwGalleryAdmin =
    user?.role === 'ADMIN' || user?.role === 'SITE_ADMIN_BFDW'

  return { user, loading, isAdmin, isBfdwGalleryAdmin }
}
