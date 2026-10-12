import { useId } from 'react'
import { PAGE_SIZES } from '../data/constants.js'

/** Pager bar. `page` is 0-based, like the service. */
export default function Pagination({ page, size, totalElements, shown, totalPages, onPageChange, onSizeChange }) {
  const sizeId = useId()
  const pages = Math.max(1, totalPages)
  const from = page * size + 1
  const range = totalElements && shown
    ? `Showing ${from}–${from + shown - 1} of ${totalElements} assets`
    : 'Showing 0 assets'

  return (
    <nav className="pager" aria-label="Pagination">
      <span aria-live="polite">{range}</span>
      <div className="size">
        <label htmlFor={sizeId}>Rows per page</label>
        <select id={sizeId} value={size} onChange={(e) => onSizeChange(Number(e.target.value))}>
          {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="ctl">
        <button
          type="button"
          className="pg"
          disabled={page <= 0}
          aria-label="Previous page"
          onClick={() => onPageChange(page - 1)}
        >
          ‹ Prev
        </button>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            className={i === page ? 'pg on' : 'pg'}
            aria-label={`Page ${i + 1}`}
            aria-current={i === page ? 'page' : undefined}
            onClick={() => onPageChange(i)}
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          className="pg"
          disabled={page >= pages - 1}
          aria-label="Next page"
          onClick={() => onPageChange(page + 1)}
        >
          Next ›
        </button>
      </div>
    </nav>
  )
}
