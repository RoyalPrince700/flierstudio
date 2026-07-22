import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { api } from '../../../lib/api'
import { formatDate } from '../format'

export default function AdminUsers() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api('/api/admin/users')
      setUsers(data.users || [])
    } catch (err) {
      setError(err?.message || 'Could not load users')
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
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Users</h1>
          <p className="admin-page__copy">
            All signed-in accounts. Promote trusted users to admin or demote as needed.
          </p>
        </div>
        <button type="button" className="admin-board__refresh" onClick={load} disabled={loading}>
          <RefreshCw size={14} strokeWidth={2.25} />
          Refresh
        </button>
      </div>

      {error ? <p className="admin-board__error">{error}</p> : null}
      {loading ? <p className="admin-board__status">Loading users…</p> : null}

      <section className="admin-board__panel">
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
                        className="admin-board__mini admin-board__mini--primary"
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
    </div>
  )
}
