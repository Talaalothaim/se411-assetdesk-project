/** Dashboard tile. `tone` is one of 'ok' | 'as' | 'rp' to colour the number. */
export default function StatCard({ label, value, tone }) {
  return (
    <div className={tone ? `card tile ${tone}` : 'card tile'}>
      <span>{label}</span>
      <strong>{value ?? '—'}</strong>
    </div>
  )
}
