import { STATUS_LABELS } from '../data/constants.js'

export default function StatusChip({ status }) {
  return <span className={`chip ${status}`}>{STATUS_LABELS[status] ?? status}</span>
}
