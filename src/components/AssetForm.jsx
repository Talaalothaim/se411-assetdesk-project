import { useId, useState } from 'react'
import {
  CONDITIONS,
  CONDITION_LABELS,
  EMPTY_ASSET,
  STATUSES,
  STATUS_LABELS,
  TYPES,
  TYPE_LABELS,
} from '../data/constants.js'
import { normalizeAsset, validateAsset } from '../services/validateAsset.js'

/** Order in which fields appear (used to focus the first invalid one). */
const FIELD_ORDER = ['deviceName', 'type', 'serialNumber', 'purchaseDate', 'condition', 'status', 'assignedTo']

function pickFields(asset) {
  const out = { ...EMPTY_ASSET }
  for (const key of FIELD_ORDER) if (asset?.[key] != null) out[key] = String(asset[key])
  return out
}

/**
 * Shared Add/Edit form. Validates with validateAsset() before calling `onSubmit(values)`.
 * If onSubmit throws an ApiError with fieldErrors (400 / 409), they are shown under the fields.
 */
export default function AssetForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => pickFields(initialValues))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const uid = useId()
  const fieldId = (name) => `${uid}-${name}`

  function showErrors(errs) {
    setErrors(errs)
    const first = FIELD_ORDER.find((f) => errs[f])
    if (first) document.getElementById(fieldId(first))?.focus()
  }

  const onChange = (name) => (e) => {
    const value = e.target.value
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      const clears = name === 'status' ? [name, 'assignedTo'] : [name]
      if (!clears.some((f) => prev[f])) return prev
      const next = { ...prev }
      clears.forEach((f) => delete next[f])
      return next
    })
  }

  /** Props shared by every control: id, value, change handler, error styling + a11y. */
  const control = (name, className = 'input') => ({
    id: fieldId(name),
    name,
    value: values[name],
    onChange: onChange(name),
    className: errors[name] ? `${className} bad` : className,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${fieldId(name)}-err` : undefined,
  })

  const errorFor = (name) =>
    errors[name] && (
      <span className="err" id={`${fieldId(name)}-err`}>{errors[name]}</span>
    )

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validateAsset(values)
    if (Object.keys(errs).length) {
      showErrors(errs)
      return
    }
    setFormError('')
    setSaving(true)
    try {
      await onSubmit(normalizeAsset(values))
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length) showErrors(err.fieldErrors)
      else setFormError(err.message || 'Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  return (
    <form className="card formcard" onSubmit={handleSubmit} noValidate>
      <div className="grid">
        <div className="field">
          <label htmlFor={fieldId('deviceName')}>Device name</label>
          <input {...control('deviceName')} placeholder="e.g. Dell Latitude 7440" autoComplete="off" />
          {errorFor('deviceName')}
        </div>
        <div className="field">
          <label htmlFor={fieldId('type')}>Type</label>
          <select {...control('type')}>
            {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
          {errorFor('type')}
        </div>
        <div className="field">
          <label htmlFor={fieldId('serialNumber')}>Serial number</label>
          <input
            {...control('serialNumber', 'input mono-input')}
            placeholder="e.g. DL7440-8F2K19"
            autoComplete="off"
            spellCheck={false}
          />
          {errorFor('serialNumber')}
        </div>
        <div className="field">
          <label htmlFor={fieldId('purchaseDate')}>Purchase date</label>
          <input {...control('purchaseDate')} type="date" />
          {errorFor('purchaseDate')}
        </div>
        <div className="field">
          <label htmlFor={fieldId('condition')}>Condition</label>
          <select {...control('condition')}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
          </select>
          {errorFor('condition')}
        </div>
        <div className="field">
          <label htmlFor={fieldId('status')}>Availability</label>
          <select {...control('status')}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          {errorFor('status')}
        </div>
        <div className="field wide">
          <label htmlFor={fieldId('assignedTo')}>
            Assigned employee <em>(required when status is Assigned)</em>
          </label>
          <input {...control('assignedTo')} placeholder="e.g. Reem Alshehri" autoComplete="off" />
          {errorFor('assignedTo')}
        </div>
      </div>

      {formError && <p className="err" role="alert" style={{ margin: 0 }}>{formError}</p>}

      <div className="actions">
        <button type="button" className="btn ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
