import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './auth/AuthContext'
import LoginScreen from './components/auth/LoginScreen'
import Studio from './components/Studio'

const THEME_KEY = 'flier-studio-theme'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // ignore
  }
  return 'dark'
}

function AuthGate({ theme, onThemeChange }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="auth-boot" data-theme={theme}>
        <p>Loading session…</p>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen theme={theme} />
  }

  return (
    <Routes>
      <Route path="/" element={<Studio theme={theme} onThemeChange={onThemeChange} />} />
      <Route path="/samples" element={<Studio theme={theme} onThemeChange={onThemeChange} />} />
      <Route
        path="/admin"
        element={
          isAdmin ? (
            <Studio theme={theme} onThemeChange={onThemeChange} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.studioTheme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  return <AuthGate theme={theme} onThemeChange={setTheme} />
}
