'use client'

import { useState, useEffect, useCallback } from 'react'

export interface AuthUser {
  id: string
  username: string
  email: string
  ubisoftId?: string | null
  platform?: string | null
}

const AUTH_EVENT = 'squadup-auth-changed'

export function setAuthSession(token: string, user: AuthUser) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function clearAuthSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function readUser() {
      const stored = localStorage.getItem('user')
      setUser(stored ? JSON.parse(stored) : null)
    }

    readUser()
    setLoading(false)

    function handleStorage(e: StorageEvent) {
      if (e.key === 'user') readUser()
    }

    window.addEventListener('storage', handleStorage) // outros separadores
    window.addEventListener(AUTH_EVENT, readUser)      // mesmo separador

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(AUTH_EVENT, readUser)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuthSession()
    window.location.href = '/'
  }, [])

  return { user, loading, logout }
}

export function updateAuthUser(user: AuthUser) {
  localStorage.setItem('user', JSON.stringify(user))
  window.dispatchEvent(new Event(AUTH_EVENT))
}