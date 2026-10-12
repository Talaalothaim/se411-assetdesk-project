import {
  ApiError,
  DELAY_MS,
  createAsset,
  deleteAsset,
  getAssetById,
  getAssets,
  getStats,
  resetStore,
  updateAsset,
  validateAsset,
} from '../services/assetService.js'

const NEW_ASSET = {
  deviceName: 'Dell Precision 5680',
  type: 'LAPTOP',
  serialNumber: 'DP5680-NEW001',
  assignedTo: '',
  condition: 'NEW',
  purchaseDate: '2026-09-01',
  status: 'AVAILABLE',
}

const ids = (res) => res.content.map((a) => a.id)

/** Runs `fn` and returns the ApiError it rejects with. */
async function apiErrorOf(fn) {
  try {
    await fn()
  } catch (e) {
    return e
  }
  throw new Error('Expected the call to reject')
}

beforeEach(() => {
  resetStore()
})

describe('assetService – setup', () => {
  it('has no artificial delay in tests', () => {
    expect(DELAY_MS).toBe(0)
  })
})

describe('getAssets – paging', () => {
  it('returns page 0 with 5 items, totalElements 12 and totalPages 3', async () => {
    const res = await getAssets()
    expect(res.page).toBe(0)
    expect(res.size).toBe(5)
    expect(res.content).toHaveLength(5)
    expect(res.totalElements).toBe(12)
    expect(res.totalPages).toBe(3)
    expect(ids(res)).toEqual([1, 2, 3, 4, 5])
  })

  it('returns 2 items on page 2 with size 5', async () => {
    const res = await getAssets({ page: 2, size: 5 })
    expect(ids(res)).toEqual([11, 12])
  })

  it('returns copies, not the stored objects', async () => {
    const first = await getAssets()
    first.content[0].deviceName = 'Changed'
    const again = await getAssets()
    expect(again.content[0].deviceName).toBe('Dell Latitude 7440')
  })
})

describe('getAssets – filters alone', () => {
  it('status=ASSIGNED', async () => {
    const res = await getAssets({ status: 'ASSIGNED', size: 20 })
    expect(res.totalElements).toBe(6)
    expect(res.content.every((a) => a.status === 'ASSIGNED')).toBe(true)
  })

  it('type=MONITOR gives 4 results', async () => {
    const res = await getAssets({ type: 'MONITOR', size: 20 })
    expect(res.totalElements).toBe(4)
    expect(ids(res)).toEqual([4, 5, 9, 11])
  })

  it('condition=FAIR', async () => {
    const res = await getAssets({ condition: 'FAIR', size: 20 })
    expect(ids(res)).toEqual([5, 12])
  })

  it("q='dell' matches device names, case-insensitively", async () => {
    const res = await getAssets({ q: 'dell', size: 20 })
    expect(ids(res)).toEqual([1, 4, 10])
  })

  it('q matches a serial number', async () => {
    const res = await getAssets({ q: 'pf3z7' })
    expect(ids(res)).toEqual([3])
  })

  it('q matches an employee name', async () => {
    const res = await getAssets({ q: 'Lama Alot' })
    expect(ids(res)).toEqual([4])
  })
})

describe('getAssets – combining and edge cases', () => {
  it('combines filters with AND and totals reflect the filtered list', async () => {
    const res = await getAssets({ type: 'MONITOR', status: 'AVAILABLE', size: 2 })
    expect(res.totalElements).toBe(3)
    expect(res.totalPages).toBe(2)
    expect(ids(res)).toEqual([5, 9])

    const all = await getAssets({ type: 'MONITOR', status: 'AVAILABLE', condition: 'NEW', q: 'apple' })
    expect(ids(all)).toEqual([9])
    expect(all.totalPages).toBe(1)
  })

  it('q does not match on type', async () => {
    const res = await getAssets({ q: 'laptop' })
    expect(res.totalElements).toBe(0)
    expect(res.content).toEqual([])
  })

  it('q does not match on id', async () => {
    const res = await getAssets({ q: '12', size: 20 })
    expect(ids(res)).not.toContain(12)
    for (const a of res.content) {
      expect([a.deviceName, a.serialNumber, a.assignedTo].join(' ')).toContain('12')
    }
  })

  it('ignores a blank q', async () => {
    const res = await getAssets({ q: '   ' })
    expect(res.totalElements).toBe(12)
  })

  it('returns results sorted by id', async () => {
    await createAsset(NEW_ASSET)
    const res = await getAssets({ size: 20 })
    expect(ids(res)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
  })
})

describe('getAssetById', () => {
  it('returns the asset', async () => {
    const a = await getAssetById(7)
    expect(a.deviceName).toBe('HP EliteBook 840 G10')
    expect(a.status).toBe('IN_REPAIR')
  })

  it('accepts a string id (as it comes from the URL)', async () => {
    expect((await getAssetById('7')).id).toBe(7)
  })

  it('throws 404 for an unknown id', async () => {
    const err = await apiErrorOf(() => getAssetById(99))
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(404)
    expect(err.message).toBe('No asset with ID 99.')
  })
})

describe('createAsset', () => {
  it('assigns the next id and the asset appears in results', async () => {
    const created = await createAsset(NEW_ASSET)
    expect(created).toEqual({ id: 13, ...NEW_ASSET })
    const res = await getAssets({ q: 'precision' })
    expect(ids(res)).toEqual([13])
    expect((await getAssets()).totalElements).toBe(13)
  })

  it('trims strings before saving', async () => {
    const created = await createAsset({ ...NEW_ASSET, deviceName: '  Spaced  ', serialNumber: ' SP-1 ' })
    expect(created.deviceName).toBe('Spaced')
    expect(created.serialNumber).toBe('SP-1')
  })

  it('never reuses an id after a delete', async () => {
    await deleteAsset(12)
    const created = await createAsset(NEW_ASSET)
    expect(created.id).toBe(13)
  })

  it('throws 400 with fieldErrors when required fields are missing', async () => {
    const err = await apiErrorOf(() =>
      createAsset({ ...NEW_ASSET, deviceName: ' ', serialNumber: '', purchaseDate: '' }),
    )
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(400)
    expect(err.fieldErrors).toEqual({
      deviceName: 'Device name is required.',
      serialNumber: 'Serial number is required.',
      purchaseDate: 'Pick a purchase date.',
    })
    expect((await getAssets()).totalElements).toBe(12)
  })

  it('throws 409 for a duplicate serial, case-insensitively', async () => {
    const err = await apiErrorOf(() => createAsset({ ...NEW_ASSET, serialNumber: 'dl7440-8f2k19' }))
    expect(err.status).toBe(409)
    expect(err.fieldErrors).toEqual({
      serialNumber: 'An asset with this serial number already exists.',
    })
  })
})

describe('updateAsset', () => {
  it('changes fields and keeps the id', async () => {
    const before = await getAssetById(3)
    const updated = await updateAsset(3, { ...before, status: 'ASSIGNED', assignedTo: 'Sara Alqahtani' })
    expect(updated.id).toBe(3)
    expect(updated.assignedTo).toBe('Sara Alqahtani')
    expect((await getAssetById(3)).status).toBe('ASSIGNED')
  })

  it('allows the asset to keep its own serial number', async () => {
    const before = await getAssetById(1)
    const updated = await updateAsset(1, { ...before, serialNumber: 'dl7440-8F2K19', condition: 'FAIR' })
    expect(updated.condition).toBe('FAIR')
  })

  it("throws 409 when using another asset's serial", async () => {
    const before = await getAssetById(1)
    const err = await apiErrorOf(() => updateAsset(1, { ...before, serialNumber: 'PF3Z7Q21' }))
    expect(err.status).toBe(409)
  })

  it('throws 400 on invalid data', async () => {
    const before = await getAssetById(1)
    const err = await apiErrorOf(() => updateAsset(1, { ...before, assignedTo: '' }))
    expect(err.status).toBe(400)
    expect(err.fieldErrors.assignedTo).toBe('Enter who this asset is assigned to.')
  })

  it('throws 404 for an unknown id', async () => {
    const err = await apiErrorOf(() => updateAsset(99, NEW_ASSET))
    expect(err.status).toBe(404)
  })
})

describe('deleteAsset', () => {
  it('removes the asset', async () => {
    await deleteAsset(5)
    const res = await getAssets({ size: 20 })
    expect(res.totalElements).toBe(11)
    expect(ids(res)).not.toContain(5)
    expect((await apiErrorOf(() => getAssetById(5))).status).toBe(404)
  })

  it('throws 404 for an unknown id', async () => {
    const err = await apiErrorOf(() => deleteAsset(99))
    expect(err.status).toBe(404)
    expect(err.message).toBe('No asset with ID 99.')
  })
})

describe('getStats', () => {
  it('summarises the inventory', async () => {
    const s = await getStats()
    expect(s).toMatchObject({ total: 12, available: 4, assigned: 6, inRepair: 2 })
    expect(s.byType).toEqual({ LAPTOP: 4, MONITOR: 4, DESKTOP: 2, ACCESSORY: 2 })
    expect(s.needsAttention.map((a) => a.id)).toEqual([5, 7, 12])
  })
})

describe('validateAsset', () => {
  it('requires assignedTo only when status is ASSIGNED', () => {
    expect(validateAsset({ ...NEW_ASSET, status: 'ASSIGNED', assignedTo: '' })).toEqual({
      assignedTo: 'Enter who this asset is assigned to.',
    })
    expect(validateAsset({ ...NEW_ASSET, status: 'ASSIGNED', assignedTo: 'Reem' })).toEqual({})
    expect(validateAsset({ ...NEW_ASSET, status: 'AVAILABLE', assignedTo: '' })).toEqual({})
    expect(validateAsset({ ...NEW_ASSET, status: 'IN_REPAIR', assignedTo: '' })).toEqual({})
  })

  it('treats whitespace-only values as empty', () => {
    const errors = validateAsset({ ...NEW_ASSET, deviceName: '   ', status: 'ASSIGNED', assignedTo: '  ' })
    expect(errors).toEqual({
      deviceName: 'Device name is required.',
      assignedTo: 'Enter who this asset is assigned to.',
    })
  })
})
