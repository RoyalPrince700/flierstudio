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
  const { user, loading } = useAuth()

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

  return <Studio theme={theme} onThemeChange={onThemeChange} />
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
