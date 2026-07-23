import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { api } from '../../../lib/api'

export default function AdminOverview() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [overview, setOverview] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const overviewRes = await api('/api/admin/overview')
      setOverview(overviewRes.overview)
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
            Snapshot of users and template publishing. Product usage lives in Google Analytics.
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
        <div className="admin-board__stats">
          <div className="admin-board__stat">
            <span className="admin-board__stat-label">Users</span>
            <strong>{overview.userCount}</strong>
          </div>
          <div className="admin-board__stat">
            <span className="admin-board__stat-label">Active logins (30d)</span>
            <strong>{overview.activeUsers30d ?? 0}</strong>
          </div>
          <div className="admin-board__stat">
            <span className="admin-board__stat-label">Published templates</span>
            <strong>{overview.templatePublished ?? 0}</strong>
          </div>
          <div className="admin-board__stat">
            <span className="admin-board__stat-label">Draft templates</span>
            <strong>{overview.templateDraft ?? 0}</strong>
          </div>
        </div>
      ) : null}
    </div>
  )
}
