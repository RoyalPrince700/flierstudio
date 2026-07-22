import { NavLink } from 'react-router-dom'
import { BarChart3, LayoutTemplate, LayoutDashboard, Users } from 'lucide-react'

const LINKS = [
  { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard, end: false },
  { to: '/admin/users', label: 'Users', icon: Users, end: false },
  { to: '/admin/templates', label: 'Templates', icon: LayoutTemplate, end: false },
  { to: '/admin/analytics', label: 'Usage', icon: BarChart3, end: false },
]

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <p className="admin-sidebar__label">Console</p>
      <nav className="admin-sidebar__nav">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `admin-sidebar__link${isActive ? ' is-active' : ''}`
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
