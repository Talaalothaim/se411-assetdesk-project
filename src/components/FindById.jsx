import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssetById } from '../services/assetService.js'

/** "Find asset by ID" card. Maps to GET /api/assets/{id}. */
export default function FindById() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const inputId = useId()
  const errorId = useId()
  const hintId = useId()

  async function onSubmit(e) {
    e.preventDefault()
    const raw = value.trim()
    if (!raw) return setError('Enter an asset ID.')
    if (!/^\d+$/.test(raw)) return setError('IDs are whole numbers, like 7.')

    setBusy(true)
    try {
      const asset = await getAssetById(Number(raw))
      setError('')
      setValue('')
      navigate(`/assets/${asset.id}`)
    } catch (err) {
      setError(err.status === 404 ? `No asset with ID ${raw}.` : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card finder" onSubmit={onSubmit} noValidate>
      <label htmlFor={inputId}>Find asset by ID</label>
      <div className="finder-row">
        <input
          id={inputId}
          className={error ? 'input bad' : 'input'}
          inputMode="numeric"
          autoComplete="off"
          placeholder="e.g. 7"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${errorId} ${hintId}` : hintId}
        />
        <button className="btn" type="submit" disabled={busy}>Find</button>
      </div>
      {error && <span className="err" id={errorId} role="alert">{error}</span>}
      <p className="hint" id={hintId}>Opens that asset&apos;s details page.</p>
    </form>
  )
}
