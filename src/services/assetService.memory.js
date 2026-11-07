/**
 * assetService – the ONLY module that touches asset data.
 *
 * Part 1: data lives in an in-memory array. Every function is async and returns
 * copies, with the same shapes the Part 2 Spring REST API will return, so this
 * file can later be swapped for fetch() calls without changing any component.
 */
import seedAssets from '../data/seedAssets.js'
import { DEFAULT_PAGE_SIZE, TYPES } from '../data/constants.js'
import ApiError from './ApiError.js'
import { normalizeAsset, validateAsset } from './validateAsset.js'

export { ApiError, validateAsset }

/** Artificial latency so loading states are visible. 0 under Vitest. */
export const DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 150

const DUPLICATE_SERIAL = 'An asset with this serial number already exists.'

let store = []
let nextId = 1

function load() {
  store = seedAssets.map((a) => ({ ...a }))
  nextId = Math.max(0, ...store.map((a) => a.id)) + 1
}
load()

const copy = (a) => ({ ...a })
const wait = () => (DELAY_MS > 0 ? new Promise((r) => setTimeout(r, DELAY_MS)) : Promise.resolve())

function toId(id) {
  const n = Number(id)
  return Number.isInteger(n) && n > 0 ? n : null
}

function findIndex(id) {
  const n = toId(id)
  const index = n === null ? -1 : store.findIndex((a) => a.id === n)
  if (index === -1) throw new ApiError(404, `No asset with ID ${id}.`)
  return index
}

function toInt(value, fallback, min) {
  const n = Number.parseInt(value, 10)
  return Number.isNaN(n) || n < min ? fallback : n
}

/** Normalizes + validates, then checks serial uniqueness (ignoring `selfId`). */
function checkAsset(data, selfId = null) {
  const asset = normalizeAsset(data)
  const fieldErrors = validateAsset(asset)
  if (Object.keys(fieldErrors).length) {
    throw new ApiError(400, 'Validation failed.', fieldErrors)
  }
  const serial = asset.serialNumber.toLowerCase()
  if (store.some((a) => a.id !== selfId && a.serialNumber.toLowerCase() === serial)) {
    throw new ApiError(409, DUPLICATE_SERIAL, { serialNumber: DUPLICATE_SERIAL })
  }
  return asset
}

/**
 * GET /api/assets?page=&size=&q=&type=&condition=&status=
 * Filters combine with AND. `q` searches deviceName, serialNumber and assignedTo.
 */
export async function getAssets({ page = 0, size = DEFAULT_PAGE_SIZE, q, type, condition, status } = {}) {
  await wait()
  const p = toInt(page, 0, 0)
  const s = toInt(size, DEFAULT_PAGE_SIZE, 1)
  const needle = (q ?? '').trim().toLowerCase()

  const filtered = store
    .filter((a) =>
      (!type || a.type === type) &&
      (!condition || a.condition === condition) &&
      (!status || a.status === status) &&
      (!needle || [a.deviceName, a.serialNumber, a.assignedTo].some((v) => v.toLowerCase().includes(needle))),
    )
    .sort((a, b) => a.id - b.id)

  return {
    content: filtered.slice(p * s, p * s + s).map(copy),
    page: p,
    size: s,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / s),
  }
}

/** GET /api/assets/{id} */
export async function getAssetById(id) {
  await wait()
  return copy(store[findIndex(id)])
}

/** POST /api/assets */
export async function createAsset(data) {
  await wait()
  const asset = { id: nextId, ...checkAsset(data) }
  nextId += 1
  store.push(asset)
  return copy(asset)
}

/** PUT /api/assets/{id} */
export async function updateAsset(id, data) {
  await wait()
  const index = findIndex(id)
  const existing = store[index]
  const asset = { id: existing.id, ...checkAsset(data, existing.id) }
  store[index] = asset
  return copy(asset)
}

/** DELETE /api/assets/{id} */
export async function deleteAsset(id) {
  await wait()
  store.splice(findIndex(id), 1)
}

/** Dashboard numbers (computed client-side in Part 2, or GET /api/assets/stats). */
export async function getStats() {
  await wait()
  const count = (fn) => store.filter(fn).length
  const byType = Object.fromEntries(TYPES.map((t) => [t, count((a) => a.type === t)]))
  const needsAttention = store
    .filter((a) => a.status === 'IN_REPAIR' || a.condition === 'FAIR' || a.condition === 'DAMAGED')
    .sort((a, b) => a.id - b.id)
    .map(copy)

  return {
    total: store.length,
    available: count((a) => a.status === 'AVAILABLE'),
    assigned: count((a) => a.status === 'ASSIGNED'),
    inRepair: count((a) => a.status === 'IN_REPAIR'),
    byType,
    needsAttention,
  }
}

/** Restores the seed data. Used by tests only. */
export function resetStore() {
  load()
}
