import { NavLink, Outlet, Link } from 'react-router-dom'
import { LogOut, Moon, Sun, Shield } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { LiftoffMark } from '../../fliers/flier-studio/FSLogo'
import { fsTokens } from '../../design/flierStudioTokens'
import AdminSidebar from './AdminSidebar'
import './AdminShell.css'
import './AdminBoard.css'

export default function AdminShell({ theme = 'dark', onThemeChange }) {
  const { user, logout } = useAuth()

  function toggleTheme() {
    onThemeChange?.(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="admin-shell" data-theme={theme}>
      <header className="admin-shell__topbar">
        <div className="admin-shell__brand">
          <LiftoffMark
            size={20}
            base={theme === 'dark' ? fsTokens.colors.paper : fsTokens.colors.ink}
            corner={fsTokens.colors.signal}
          />
          <strong>Flier Studio</strong>
          <span className="admin-shell__sep" />
          <span className="admin-shell__badge">
            <Shield size={12} strokeWidth={2.25} />
            Admin Console
          </span>
        </div>

        <div className="admin-shell__top-actions">
          <Link to="/templates" className="admin-shell__link">
            Open Studio
          </Link>
          <Link to="/templates" className="admin-shell__link">
            Templates
          </Link>
          <span className="admin-shell__user" title={user?.email || ''}>
            {user?.name || 'Admin'}
          </span>
          <button
            type="button"
            className="admin-shell__icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            type="button"
            className="admin-shell__icon-btn"
            onClick={() => logout()}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="admin-shell__body">
        <AdminSidebar />
        <main className="admin-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
