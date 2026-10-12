import { useId } from 'react'
import {
  CONDITIONS,
  CONDITION_LABELS,
  STATUSES,
  STATUS_LABELS,
  TYPES,
  TYPE_LABELS,
} from '../data/constants.js'
import { SearchIcon } from './Icons.jsx'

/**
 * "Filter by" card. Fully controlled: the parent owns the values (kept in the URL).
 * `search` is the live text in the box; the parent debounces it before querying.
 */
export default function FilterBar({
  search,
  type,
  condition,
  status,
  activeCount,
  totalElements,
  onSearchChange,
  onChange,
  onClear,
}) {
  const id = useId()
  const meta = activeCount
    ? `${activeCount} filter${activeCount > 1 ? 's' : ''} active · ${totalElements ?? '…'} result${totalElements === 1 ? '' : 's'}`
    : `No filters · ${totalElements ?? '…'} assets`

  return (
    <div className="card filters" role="search" aria-label="Filter assets">
      <div className="fhead">
        <h2>Filter by</h2>
        <div className="fmeta">
          <span aria-live="polite">{meta}</span>
          <button className="linkbtn" type="button" onClick={onClear} disabled={!activeCount}>
            Clear filters
          </button>
        </div>
      </div>

      <div className="fgrid">
        <div>
          <label className="flabel" htmlFor={`${id}-q`}>Search</label>
          <div className="sw">
            <SearchIcon />
            <input
              id={`${id}-q`}
              className="input"
              type="search"
              placeholder="Device name, serial or employee"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="flabel" htmlFor={`${id}-type`}>Type</label>
          <select
            id={`${id}-type`}
            className="input"
            value={type}
            onChange={(e) => onChange({ type: e.target.value })}
          >
            <option value="">All types</option>
            {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
        </div>
        <div>
          <label className="flabel" htmlFor={`${id}-cond`}>Condition</label>
          <select
            id={`${id}-cond`}
            className="input"
            value={condition}
            onChange={(e) => onChange({ condition: e.target.value })}
          >
            <option value="">All conditions</option>
            {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
          </select>
        </div>
      </div>

      <div className="frow">
        <span className="flabel" id={`${id}-status`}>Status</span>
        <div className="pills" role="group" aria-labelledby={`${id}-status`}>
          {['', ...STATUSES].map((s) => (
            <button
              key={s || 'ALL'}
              type="button"
              className={s === status ? 'pill on' : 'pill'}
              aria-pressed={s === status}
              onClick={() => onChange({ status: s })}
            >
              {s ? STATUS_LABELS[s] : 'All'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
