
import { DEFAULT_PAGE_SIZE } from '../data/constants.js'
import ApiError from './ApiError.js'
import { normalizeAsset, validateAsset } from './validateAsset.js'

export { ApiError, validateAsset }

const API_URL = 'http://localhost:8080/api/assets'

export const DELAY_MS = 0

async function request(url, options = {}) {
  let response

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError(
      503,
      'Cannot connect to the Spring Boot server.'
    )
  }

  if (!response.ok) {
    let error

    try {
      error = await response.json()
    } catch {
      error = null
    }

    throw new ApiError(
      response.status,
      error?.message || 'Request failed.',
      error?.fieldErrors || {}
    )
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()

  return text ? JSON.parse(text) : null
}

function toId(id) {
  const value = Number(id)

  if (!Number.isInteger(value) || value <= 0) {
    throw new ApiError(404, `No asset with ID ${id}.`)
  }

  return value
}

export async function getAssets({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
  q,
  type,
  condition,
  status,
} = {}) {
  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('size', String(size))

  if (q) {
    params.set('q', q)
  }

  if (type) {
    params.set('type', type)
  }

  if (condition) {
    params.set('condition', condition)
  }

  if (status) {
    params.set('status', status)
  }

  return request(`${API_URL}?${params.toString()}`)
}

export async function getAssetById(id) {
  return request(`${API_URL}/${toId(id)}`)
}

export async function createAsset(data) {
  const asset = normalizeAsset(data)
  const fieldErrors = validateAsset(asset)

  if (Object.keys(fieldErrors).length > 0) {
    throw new ApiError(
      400,
      'Validation failed.',
      fieldErrors
    )
  }

  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify(asset),
  })
}

export async function updateAsset(id, data) {
  const asset = normalizeAsset(data)
  const fieldErrors = validateAsset(asset)

  if (Object.keys(fieldErrors).length > 0) {
    throw new ApiError(
      400,
      'Validation failed.',
      fieldErrors
    )
  }

  return request(`${API_URL}/${toId(id)}`, {
    method: 'PUT',
    body: JSON.stringify(asset),
  })
}

export async function deleteAsset(id) {
  return request(`${API_URL}/${toId(id)}`, {
    method: 'DELETE',
  })
}

export async function getStats() {
  return request(`${API_URL}/stats`)
}

export function resetStore() {
  throw new Error(
    'resetStore is unavailable when using the Spring Boot backend.'
  )
}
