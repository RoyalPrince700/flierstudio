import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, Shield } from 'lucide-react'
import { api } from '../../lib/api'
import './AdminBoard.css'

function formatDate(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return '—'
  }
}

export default function AdminBoard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [topDesigns, setTopDesigns] = useState([])
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [overviewRes, usersRes, eventsRes] = await Promise.all([
        api('/api/admin/overview'),
        api('/api/admin/users'),
        api('/api/admin/events?limit=40'),
      ])
      setOverview(overviewRes.overview)
      setTopDesigns(overviewRes.topDesigns || [])
      setUsers(usersRes.users || [])
      setEvents(eventsRes.events || [])
    } catch (err) {
      setError(err?.message || 'Could not load admin data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function setRole(userId, role) {
    setBusyId(userId)
    setError('')
    try {
      const data = await api(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: { role },
      })
      setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)))
    } catch (err) {
      setError(err?.message || 'Could not update role')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="admin-board">
      <div className="admin-board__header">
        <div>
          <p className="admin-board__eyebrow">
            <Shield size={14} strokeWidth={2.25} />
            Admin
          </p>
          <h1 className="admin-board__title">Users & activity</h1>
          <p className="admin-board__copy">
            Track who signed in and what they use. Design events fill in once tracking is wired to
            select / edit / download.
          </p>
        </div>
        <button type="button" className="admin-board__refresh" onClick={load} disabled={loading}>
          <RefreshCw size={14} strokeWidth={2.25} />
          Refresh
        </button>
      </div>

      {error ? <p className="admin-board__error">{error}</p> : null}
      {loading ? <p className="admin-board__status">Loading admin data…</p> : null}

      {!loading && overview ? (
        <div className="admin-board__stats">
          <div className="admin-board__stat">
            <span className="admin-board__stat-label">Users</span>
            <strong>{overview.userCount}</strong>
          </div>
          <div className="admin-board__stat">
            <span className="admin-board__stat-label">Admins</span>
            <strong>{overview.adminCount}</strong>
          </div>
          <div className="admin-board__stat">
            <span className="admin-board__stat-label">Active (30d)</span>
            <strong>{overview.activeUsers30d}</strong>
          </div>
          <div className="admin-board__stat">
            <span className="admin-board__stat-label">Events (30d)</span>
            <strong>{overview.eventCount30d}</strong>
          </div>
        </div>
      ) : null}

      <div className="admin-board__grid">
        <section className="admin-board__panel">
          <h2>Users</h2>
          <div className="admin-board__table-wrap">
            <table className="admin-board__table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Last login</th>
                  <th>Joined</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-board__user">
                        {u.avatar ? (
                          <img src={u.avatar} alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="admin-board__avatar-fallback" />
                        )}
                        <div>
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-board__role admin-board__role--${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{formatDate(u.lastLoginAt)}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      {u.role === 'admin' ? (
                        <button
                          type="button"
                          className="admin-board__mini"
                          disabled={busyId === u.id}
                          onClick={() => setRole(u.id, 'user')}
                        >
                          Make user
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="admin-board__mini"
                          disabled={busyId === u.id}
                          onClick={() => setRole(u.id, 'admin')}
                        >
                          Make admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!users.length && !loading ? (
                  <tr>
                    <td colSpan={5} className="admin-board__empty">
                      No users yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-board__panel">
          <h2>Top designs (30d)</h2>
          {topDesigns.length ? (
            <ul className="admin-board__list">
              {topDesigns.map((row) => (
                <li key={`${row.projectId}-${row.designId}-${row.action}`}>
                  <strong>
                    {row.projectId}/{row.designId}
                  </strong>
                  <span>
                    {row.action} · {row.count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-board__empty">No design activity logged yet.</p>
          )}

          <h2 className="admin-board__subhead">Recent events</h2>
          {events.length ? (
            <ul className="admin-board__list">
              {events.map((event) => (
                <li key={event.id}>
                  <strong>
                    {event.user?.email || 'Unknown'} · {event.action}
                  </strong>
                  <span>
                    {[event.projectId, event.designId].filter(Boolean).join('/') || '—'} ·{' '}
                    {formatDate(event.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-board__empty">No events yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
