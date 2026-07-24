import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, ApiError } from '../lib/api'
import { clearAuthToken, getAuthToken, setAuthToken } from '../lib/authToken'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const data = await api('/api/auth/me')
      setUser(data.user)
      setError('')
      return data.user
    } catch (err) {
      // Boot GET /api/auth/me → 401 while logged out is expected (not a Google bug).
      // Only clear Bearer when we had one — session was expected and failed.
      if (err instanceof ApiError && err.status === 401 && getAuthToken()) {
        clearAuthToken()
      }
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        await refresh()
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const loginWithGoogle = useCallback(async (credential) => {
    setError('')
    const data = await api('/api/auth/google', {
      method: 'POST',
      body: { credential },
    })
    // Store before setUser so RequireAuth children (e.g. templates) can auth APIs.
    if (data.token) setAuthToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    setError('')
    try {
      await api('/api/auth/logout', { method: 'POST' })
    } finally {
      clearAuthToken()
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      setError,
      isAdmin: user?.role === 'admin',
      loginWithGoogle,
      logout,
      refresh,
    }),
    [user, loading, error, loginWithGoogle, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
