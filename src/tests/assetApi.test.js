
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { DEFAULT_PAGE_SIZE } from '../data/constants.js'

vi.unmock('../services/assetService.js')

import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getStats,
} from '../services/assetService.js'

const asset = {
  id: 13,
  deviceName: 'HP EliteBook 840',
  type: 'LAPTOP',
  serialNumber: 'HP840-TEST-001',
  assignedTo: '',
  condition: 'NEW',
  purchaseDate: '2026-11-07',
  status: 'AVAILABLE',
}

const assetInput = {
  deviceName: asset.deviceName,
  type: asset.type,
  serialNumber: asset.serialNumber,
  assignedTo: asset.assignedTo,
  condition: asset.condition,
  purchaseDate: asset.purchaseDate,
  status: asset.status,
}

function mockResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
    text: vi.fn().mockResolvedValue(
      body == null ? '' : JSON.stringify(body)
    ),
  }
}

describe('Spring Boot API integration', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('retrieves paginated assets', async () => {
    const page = {
      content: [asset],
      page: 0,
      size: DEFAULT_PAGE_SIZE,
      totalElements: 1,
      totalPages: 1,
    }

    fetch.mockResolvedValue(mockResponse(page))

    const result = await getAssets()

    expect(result).toEqual(page)
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/api/assets?page=0&size=${DEFAULT_PAGE_SIZE}`,
      expect.any(Object)
    )
  })

  it('retrieves an asset by ID', async () => {
    fetch.mockResolvedValue(mockResponse(asset))

    const result = await getAssetById(13)

    expect(result).toEqual(asset)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/assets/13',
      expect.any(Object)
    )
  })

  it('creates an asset using POST', async () => {
    fetch.mockResolvedValue(mockResponse(asset, 201))

    const result = await createAsset(assetInput)

    expect(result).toEqual(asset)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/assets',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(assetInput),
      })
    )
  })

  it('updates an asset using PUT', async () => {
    fetch.mockResolvedValue(mockResponse(asset))

    const result = await updateAsset(13, assetInput)

    expect(result).toEqual(asset)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/assets/13',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(assetInput),
      })
    )
  })

  it('deletes an asset using DELETE', async () => {
    fetch.mockResolvedValue(mockResponse(null, 204))

    const result = await deleteAsset(13)

    expect(result).toBeNull()
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/assets/13',
      expect.objectContaining({
        method: 'DELETE',
      })
    )
  })

  it('retrieves dashboard statistics', async () => {
    const stats = {
      total: 13,
      available: 5,
      assigned: 7,
      inRepair: 1,
      byType: {},
      needsAttention: [],
    }

    fetch.mockResolvedValue(mockResponse(stats))

    expect(await getStats()).toEqual(stats)
  })

  it('handles missing assets with HTTP 404', async () => {
    fetch.mockResolvedValue(
      mockResponse({
        message: 'No asset with ID 999.',
        fieldErrors: {},
      }, 404)
    )

    await expect(getAssetById(999)).rejects.toMatchObject({
      status: 404,
      message: 'No asset with ID 999.',
    })
  })

  it('handles a disconnected backend', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await expect(getAssets()).rejects.toMatchObject({
      status: 503,
    })
  })
})
