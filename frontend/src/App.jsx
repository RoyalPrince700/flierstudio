import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './auth/AuthContext'
import LoginScreen from './components/auth/LoginScreen'
import LandingPage from './components/landing/LandingPage'
import Studio from './components/Studio'
import AdminShell from './components/admin/AdminShell'
import AdminOverview from './components/admin/pages/AdminOverview'
import AdminUsers from './components/admin/pages/AdminUsers'
import AdminTemplates from './components/admin/pages/AdminTemplates'
import PrivacyPage from './components/legal/PrivacyPage'
import TermsPage from './components/legal/TermsPage'
import AboutPage from './components/legal/AboutPage'
import ContactPage from './components/legal/ContactPage'

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

function RequireAuth({ theme, children }) {
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

  return children
}

function AdminOnly({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/studio" replace />
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

  const studio = <Studio theme={theme} onThemeChange={setTheme} />
  const adminShell = <AdminShell theme={theme} onThemeChange={setTheme} />

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/studio" element={<RequireAuth theme={theme}>{studio}</RequireAuth>} />
      <Route path="/templates" element={<RequireAuth theme={theme}>{studio}</RequireAuth>} />
      <Route path="/samples" element={<Navigate to="/templates" replace />} />
      <Route
        path="/admin"
        element={
          <RequireAuth theme={theme}>
            <AdminOnly>{adminShell}</AdminOnly>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="templates" element={<AdminTemplates />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
