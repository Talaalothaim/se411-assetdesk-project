import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom has no matchMedia; default to a wide screen (sidebar pinned open).
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })
}

if (typeof window !== 'undefined') {
  window.scrollTo = () => {}
}

afterEach(() => {
  cleanup()
})


vi.mock('../services/assetService.js', async () => {
  return import('../services/assetService.memory.js')
})
