import { useCallback, useEffect, useState } from 'react'
import { getAssetById, getAssets, getStats } from '../services/assetService.js'

/**
 * Shared loading logic: runs `load` whenever `key` changes and tracks
 * { data, error, loading }. Previous data stays visible while reloading.
 * Results from out-of-date requests are ignored.
 */
function useLoad(load, key) {
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const fullKey = `${key}#${version}`

  useEffect(() => {
    let active = true
    load().then(
      (data) => active && setResult({ key: fullKey, data, error: null }),
      (error) => active && setResult({ key: fullKey, data: null, error }),
    )
    return () => {
      active = false
    }
    // `load` is rebuilt each render; `fullKey` captures everything it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return {
    data: result.data,
    error: result.error,
    loading: result.key !== fullKey,
    reload,
  }
}

/** One page of assets for the given filters (see assetService.getAssets). */
export function useAssetPage({ page, size, q, type, condition, status }) {
  const params = { page, size, q, type, condition, status }
  return useLoad(() => getAssets(params), JSON.stringify(params))
}

/** A single asset (see assetService.getAssetById). `data` is null while loading a new id. */
export function useAsset(id) {
  const result = useLoad(() => getAssetById(id), `asset:${id}`)
  return result.loading ? { ...result, data: null, error: null } : result
}

/** Dashboard statistics (see assetService.getStats). */
export function useStats() {
  return useLoad(() => getStats(), 'stats')
}
