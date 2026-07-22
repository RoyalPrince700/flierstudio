import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { api } from '../../../lib/api'
import { formatDate } from '../format'

export default function AdminOverview() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [overview, setOverview] = useState(null)
  const [topDesigns, setTopDesigns] = useState([])
  const [events, setEvents] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [overviewRes, eventsRes] = await Promise.all([
        api('/api/admin/overview'),
        api('/api/admin/events?limit=12'),
      ])
      setOverview(overviewRes.overview)
      setTopDesigns(overviewRes.topDesigns || [])
      setEvents(eventsRes.events || [])
    } catch (err) {
      setError(err?.message || 'Could not load overview')
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
          <h1 className="admin-page__title">Overview</h1>
          <p className="admin-page__copy">
            Snapshot of users, template publishing, and recent studio activity.
          </p>
        </div>
        <button type="button" className="admin-board__refresh" onClick={load} disabled={loading}>
          <RefreshCw size={14} strokeWidth={2.25} />
          Refresh
        </button>
      </div>

      {error ? <p className="admin-board__error">{error}</p> : null}
      {loading ? <p className="admin-board__status">Loading…</p> : null}

      {!loading && overview ? (
        <>
          <div className="admin-board__stats">
            <div className="admin-board__stat">
              <span className="admin-board__stat-label">Users</span>
              <strong>{overview.userCount}</strong>
            </div>
            <div className="admin-board__stat">
              <span className="admin-board__stat-label">Published templates</span>
              <strong>{overview.templatePublished ?? 0}</strong>
            </div>
            <div className="admin-board__stat">
              <span className="admin-board__stat-label">Draft templates</span>
              <strong>{overview.templateDraft ?? 0}</strong>
            </div>
            <div className="admin-board__stat">
              <span className="admin-board__stat-label">Events (30d)</span>
              <strong>{overview.eventCount30d}</strong>
            </div>
          </div>

          <div className="admin-board__grid">
            <section className="admin-board__panel">
              <h2>Top templates & designs (30d)</h2>
              {topDesigns.length ? (
                <ul className="admin-board__list">
                  {topDesigns.slice(0, 10).map((row) => (
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
                <p className="admin-board__empty">
                  No template or design activity yet. Events appear when users open templates,
                  edit, or export.
                </p>
              )}
            </section>

            <section className="admin-board__panel">
              <h2>Recent activity</h2>
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
              <p className="admin-board__empty" style={{ marginTop: 12 }}>
                <Link to="/admin/analytics">View full usage analytics →</Link>
              </p>
            </section>
          </div>
        </>
      ) : null}
    </div>
  )
}
