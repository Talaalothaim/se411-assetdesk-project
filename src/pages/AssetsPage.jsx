import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AssetTable from '../components/AssetTable.jsx'
import FilterBar from '../components/FilterBar.jsx'
import FindById from '../components/FindById.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Pagination from '../components/Pagination.jsx'
import { CONDITIONS, DEFAULT_PAGE_SIZE, PAGE_SIZES, STATUSES, TYPES } from '../data/constants.js'
import { useAssetPage } from '../hooks/useAssets.js'
import useDeleteAsset from '../hooks/useDeleteAsset.jsx'

const SEARCH_DEBOUNCE_MS = 250

const oneOf = (value, allowed) => (allowed.includes(value) ? value : '')

/** Reads the list state from the URL: ?q=&type=&condition=&status=&page=&size= (page is 1-based). */
function readParams(sp) {
  const page = Number.parseInt(sp.get('page'), 10)
  const size = Number(sp.get('size'))
  return {
    q: sp.get('q') ?? '',
    type: oneOf(sp.get('type'), TYPES),
    condition: oneOf(sp.get('condition'), CONDITIONS),
    status: oneOf(sp.get('status'), STATUSES),
    page: Number.isInteger(page) && page > 0 ? page - 1 : 0,
    size: PAGE_SIZES.includes(size) ? size : DEFAULT_PAGE_SIZE,
  }
}

/** Writes the list state back, leaving defaults out so URLs stay short. */
function toSearchParams({ q, type, condition, status, page, size }) {
  const sp = new URLSearchParams()
  if (q) sp.set('q', q)
  if (type) sp.set('type', type)
  if (condition) sp.set('condition', condition)
  if (status) sp.set('status', status)
  if (page > 0) sp.set('page', String(page + 1))
  if (size !== DEFAULT_PAGE_SIZE) sp.set('size', String(size))
  return sp
}

export default function AssetsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = readParams(searchParams)
  const { data, error, loading, reload } = useAssetPage(params)
  const { askDelete, dialog } = useDeleteAsset(reload)

  const update = (changes, { replace = false } = {}) => {
    const resetsPage = !('page' in changes)
    setSearchParams(toSearchParams({ ...params, ...(resetsPage && { page: 0 }), ...changes }), { replace })
  }

  // The search box updates instantly; the URL (and the query) follow after a pause.
  const [search, setSearch] = useState(params.q)
  const [syncedQ, setSyncedQ] = useState(params.q)
  if (syncedQ !== params.q) {
    // q changed from outside the box (back button, Clear filters): show it.
    setSyncedQ(params.q)
    if (search.trim() !== params.q) setSearch(params.q)
  }
  useEffect(() => {
    const next = search.trim()
    if (next === params.q) return undefined
    const t = setTimeout(() => update({ q: next }, { replace: true }), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
    // Only the typed text should restart the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // A page past the end (e.g. after deletes) snaps back to the last page.
  const totalPages = data?.totalPages
  useEffect(() => {
    if (loading || totalPages === undefined) return
    const last = Math.max(0, totalPages - 1)
    if (params.page > last) update({ page: last }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, totalPages, params.page])

  const activeCount = [params.q, params.type, params.condition, params.status].filter(Boolean).length

  const clearFilters = () => {
    setSearch('')
    update({ q: '', type: '', condition: '', status: '' })
  }

  return (
    <section className="screen">
      <PageHeader eyebrow="Inventory" title="Assets">
        <Link className="btn" to="/assets/new">+ Add asset</Link>
      </PageHeader>

      <FindById />

      <FilterBar
        search={search}
        type={params.type}
        condition={params.condition}
        status={params.status}
        activeCount={activeCount}
        totalElements={data?.totalElements}
        onSearchChange={setSearch}
        onChange={(changes) => update(changes)}
        onClear={clearFilters}
      />

      <div className="card clip">
        {error && (
          <div className="empty" role="alert">
            <b>Could not load assets</b>
            {error.message}
          </div>
        )}
        {!data && !error && (
          <div className="loading" role="status">Loading assets…</div>
        )}
        {data && (
          <>
            {data.totalElements > 0 ? (
              <AssetTable assets={data.content} busy={loading} onDelete={askDelete} />
            ) : (
              <div className="empty">
                <b>No assets match</b>
                Try a different search or status filter.
              </div>
            )}
            <Pagination
              page={data.page}
              size={data.size}
              totalElements={data.totalElements}
              shown={data.content.length}
              totalPages={data.totalPages}
              onPageChange={(page) => update({ page })}
              onSizeChange={(size) => update({ size })}
            />
          </>
        )}
      </div>

      {dialog}
    </section>
  )
}
