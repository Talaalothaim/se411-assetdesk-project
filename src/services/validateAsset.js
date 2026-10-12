import { CONDITIONS, STATUSES, TYPES } from '../data/constants.js'

const TEXT_FIELDS = ['deviceName', 'serialNumber', 'assignedTo', 'purchaseDate']
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** Keeps only the asset fields and trims every string. */
export function normalizeAsset(data = {}) {
  const out = {
    deviceName: data.deviceName,
    type: data.type,
    serialNumber: data.serialNumber,
    assignedTo: data.assignedTo,
    condition: data.condition,
    purchaseDate: data.purchaseDate,
    status: data.status,
  }
  for (const key of Object.keys(out)) {
    out[key] = typeof out[key] === 'string' ? out[key].trim() : out[key] ?? ''
  }
  for (const key of TEXT_FIELDS) out[key] = String(out[key])
  return out
}

/**
 * Validates an asset. Used by both the service and the form.
 * Returns an object of { field: message }; empty when the asset is valid.
 */
export function validateAsset(data) {
  const a = normalizeAsset(data)
  const errors = {}

  if (!a.deviceName) errors.deviceName = 'Device name is required.'
  if (!a.serialNumber) errors.serialNumber = 'Serial number is required.'
  if (!a.purchaseDate) errors.purchaseDate = 'Pick a purchase date.'
  else if (!DATE_RE.test(a.purchaseDate) || Number.isNaN(Date.parse(a.purchaseDate))) {
    errors.purchaseDate = 'Enter a valid date.'
  }
  if (!TYPES.includes(a.type)) errors.type = 'Choose a valid type.'
  if (!CONDITIONS.includes(a.condition)) errors.condition = 'Choose a valid condition.'
  if (!STATUSES.includes(a.status)) errors.status = 'Choose a valid status.'
  if (a.status === 'ASSIGNED' && !a.assignedTo) {
    errors.assignedTo = 'Enter who this asset is assigned to.'
  }

  return errors
}

export default validateAsset
