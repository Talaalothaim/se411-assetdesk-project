import { Link } from 'react-router-dom'
import { CONDITION_LABELS, TYPE_LABELS } from '../data/constants.js'
import { formatDate } from '../utils/format.js'
import { EditIcon, TrashIcon } from './Icons.jsx'
import StatusChip from './StatusChip.jsx'

export default function AssetTable({ assets, onDelete, busy }) {
  return (
    <div className="scroll">
      <table aria-busy={busy || undefined} style={busy ? { opacity: 0.6 } : undefined}>
        <caption className="sr-only">Assets</caption>
        <thead>
          <tr>
            <th scope="col" style={{ width: 56 }}>ID</th>
            <th scope="col">Device</th>
            <th scope="col">Serial number</th>
            <th scope="col">Assigned to</th>
            <th scope="col">Condition</th>
            <th scope="col">Purchased</th>
            <th scope="col">Status</th>
            <th scope="col" className="act">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.id}>
              <td className="id">{a.id}</td>
              <td>
                <Link className="dev-link" to={`/assets/${a.id}`}>{a.deviceName}</Link>
                <div className="sub">{TYPE_LABELS[a.type]}</div>
              </td>
              <td className="serial">{a.serialNumber}</td>
              <td>{a.assignedTo || '—'}</td>
              <td>{CONDITION_LABELS[a.condition]}</td>
              <td>{formatDate(a.purchaseDate)}</td>
              <td><StatusChip status={a.status} /></td>
              <td className="act">
                <Link className="ib" to={`/assets/${a.id}/edit`} aria-label={`Edit ${a.deviceName}`}>
                  <EditIcon />
                </Link>
                {onDelete && (
                  <button
                    type="button"
                    className="ib del"
                    aria-label={`Delete ${a.deviceName}`}
                    onClick={() => onDelete(a)}
                  >
                    <TrashIcon />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
