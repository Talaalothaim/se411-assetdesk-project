import { Link, useNavigate, useParams } from 'react-router-dom'
import AssetLoadError from '../components/AssetLoadError.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatusChip from '../components/StatusChip.jsx'
import { CONDITION_LABELS, TYPE_LABELS } from '../data/constants.js'
import { useAsset } from '../hooks/useAssets.js'
import useDeleteAsset from '../hooks/useDeleteAsset.jsx'
import { formatDate } from '../utils/format.js'

export default function AssetDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: asset, error } = useAsset(id)
  const { askDelete, dialog } = useDeleteAsset(() => navigate('/assets', { replace: true }))

  if (error) return <AssetLoadError id={id} error={error} />

  if (!asset) {
    return (
      <section className="screen" aria-busy="true">
        <PageHeader eyebrow={`Asset ID ${id}`} title="Loading…" />
      </section>
    )
  }

  const rows = [
    ['ID', asset.id, true],
    ['Type', TYPE_LABELS[asset.type]],
    ['Serial number', asset.serialNumber, true],
    ['Assigned to', asset.assignedTo || '—'],
    ['Condition', CONDITION_LABELS[asset.condition]],
    ['Purchase date', formatDate(asset.purchaseDate)],
  ]

  return (
    <section className="screen">
      <PageHeader eyebrow={`Asset ID ${asset.id}`} title={asset.deviceName}>
        <Link className="btn ghost" to="/assets">← Back to assets</Link>
      </PageHeader>

      <div className="card details">
        <div className="dhead">
          <StatusChip status={asset.status} />
          <div className="dactions">
            <button type="button" className="btn ghost" onClick={() => askDelete(asset)}>Delete</button>
            <Link className="btn" to={`/assets/${asset.id}/edit`}>Edit asset</Link>
          </div>
        </div>
        <dl className="dl">
          {rows.map(([label, value, mono]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={mono ? 'mono-val' : undefined}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {dialog}
    </section>
  )
}
