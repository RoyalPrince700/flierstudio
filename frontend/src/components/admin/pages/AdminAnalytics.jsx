import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { api } from '../../../lib/api'
import { formatDate } from '../format'

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [byTemplate, setByTemplate] = useState([])
  const [byAction, setByAction] = useState([])
  const [recentEvents, setRecentEvents] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api('/api/admin/analytics/templates')
      setByTemplate(data.byTemplate || [])
      setByAction(data.byAction || [])
      setRecentEvents(data.recentEvents || [])
    } catch (err) {
      setError(err?.message || 'Could not load analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Usage & analytics</h1>
          <p className="admin-page__copy">
            Template opens, edits, and exports over the last 30 days — sourced from real studio
            events.
          </p>
        </div>
        <button type="button" className="admin-board__refresh" onClick={load} disabled={loading}>
          <RefreshCw size={14} strokeWidth={2.25} />
          Refresh
        </button>
      </div>

      {error ? <p className="admin-board__error">{error}</p> : null}
      {loading ? <p className="admin-board__status">Loading analytics…</p> : null}

      {!loading ? (
        <div className="admin-board__grid">
          <section className="admin-board__panel">
            <h2>Events by action (30d)</h2>
            {byAction.length ? (
              <ul className="admin-board__list">
                {byAction.map((row) => (
                  <li key={row.action}>
                    <strong>{row.action}</strong>
                    <span>{row.count} events</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-board__empty">No events recorded yet.</p>
            )}

            <h2 className="admin-board__subhead">Most-used templates & designs (30d)</h2>
            {byTemplate.length ? (
              <ul className="admin-board__list">
                {byTemplate.map((row) => (
                  <li key={`${row.projectId}-${row.designId}-${row.action}`}>
                    <strong>
                      {row.designId}
                      {row.projectId ? ` · ${row.projectId}` : ''}
                    </strong>
                    <span>
                      {row.action} · {row.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-board__empty">
                Opens and exports will appear here once users interact with templates in the studio.
              </p>
            )}
          </section>

          <section className="admin-board__panel">
            <h2>Recent events (30d)</h2>
            {recentEvents.length ? (
              <ul className="admin-board__list">
                {recentEvents.map((event) => (
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
              <p className="admin-board__empty">No recent events.</p>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
