const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** '2025-02-14' → '14 Feb 2025'. Returns '—' for an empty value. */
export function formatDate(value) {
  if (!value) return '—'
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d || m > 12) return value
  return `${d} ${MONTHS[m - 1]} ${y}`
}
