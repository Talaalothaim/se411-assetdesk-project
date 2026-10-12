import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import StatusChip from '../components/StatusChip.jsx'
import { CONDITION_LABELS, TYPES, TYPE_PLURAL_LABELS } from '../data/constants.js'
import { useStats } from '../hooks/useAssets.js'

export default function DashboardPage() {
  const { data: stats, error } = useStats()
  const maxType = stats ? Math.max(1, ...TYPES.map((t) => stats.byType[t])) : 1

  return (
    <section className="screen" aria-busy={!stats && !error}>
      <PageHeader eyebrow="Overview" title="Dashboard">
        <Link className="btn" to="/assets/new">+ Add asset</Link>
      </PageHeader>

      {error && <p className="err" role="alert">Could not load the dashboard: {error.message}</p>}

      <div className="tiles">
        <StatCard label="Total assets" value={stats?.total} />
        <StatCard label="Available" value={stats?.available} tone="ok" />
        <StatCard label="Assigned" value={stats?.assigned} tone="as" />
        <StatCard label="In repair" value={stats?.inRepair} tone="rp" />
      </div>

      <div className="panels">
        <div className="card panel">
          <h2>Assets by type</h2>
          <div className="bars">
            {TYPES.map((t) => {
              const n = stats?.byType[t] ?? 0
              return (
                <div key={t}>
                  <div className="bar-top">
                    <span>{TYPE_PLURAL_LABELS[t]}</span>
                    <span>{stats ? n : '—'}</span>
                  </div>
                  <div className="track" aria-hidden="true">
                    <div className="fill" style={{ width: `${Math.round((n / maxType) * 100)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card panel">
          <h2>Needs attention</h2>
          <p className="note">Devices in repair or in fair/damaged condition</p>
          {!stats ? (
            <p className="note">Loading…</p>
          ) : stats.needsAttention.length === 0 ? (
            <p className="note">Nothing needs attention.</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {stats.needsAttention.map((a) => (
                <li className="att" key={a.id}>
                  <div style={{ minWidth: 0 }}>
                    <Link className="n" to={`/assets/${a.id}`}>{a.deviceName}</Link>
                    <div className="mono">
                      ID {a.id} · {a.serialNumber} · {CONDITION_LABELS[a.condition]}
                    </div>
                  </div>
                  <StatusChip status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
