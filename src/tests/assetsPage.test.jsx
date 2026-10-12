import { screen, waitFor, within } from '@testing-library/react'
import { resetStore } from '../services/assetService.js'
import { renderApp } from './renderApp.jsx'

beforeEach(() => {
  resetStore()
})

/** IDs shown in the table, in order. */
function shownIds() {
  const table = screen.getByRole('table', { name: 'Assets' })
  return within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) => Number(within(row).getAllByRole('cell')[0].textContent))
}

const rangeText = (text) => screen.findByText(text)
const filterMeta = (text) => within(screen.getByRole('search', { name: 'Filter assets' })).findByText(text)

describe('Assets page – table and pagination', () => {
  it('shows the first 5 of 12 assets, and Next shows ids 6–10', async () => {
    const { user } = renderApp('/assets')
    await rangeText('Showing 1–5 of 12 assets')
    expect(shownIds()).toEqual([1, 2, 3, 4, 5])
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    await rangeText('Showing 6–10 of 12 assets')
    expect(shownIds()).toEqual([6, 7, 8, 9, 10])
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('shows table cells in the mockup format', async () => {
    renderApp('/assets')
    await rangeText('Showing 1–5 of 12 assets')
    const row = screen.getByRole('link', { name: 'Dell Latitude 7440' }).closest('tr')
    expect(row).toHaveTextContent('DL7440-8F2K19')
    expect(row).toHaveTextContent('14 Feb 2025')
    expect(row).toHaveTextContent('Assigned')
    expect(within(row).getByRole('link', { name: 'Edit Dell Latitude 7440' })).toHaveAttribute('href', '/assets/1/edit')
    const available = screen.getByRole('link', { name: 'Lenovo ThinkPad X1 Carbon' }).closest('tr')
    expect(available).toHaveTextContent('—')
  })

  it('changes rows per page', async () => {
    const { user } = renderApp('/assets')
    await rangeText('Showing 1–5 of 12 assets')
    await user.selectOptions(screen.getByLabelText('Rows per page'), '20')
    await rangeText('Showing 1–12 of 12 assets')
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('snaps an out-of-range page in the URL back to the last page', async () => {
    renderApp('/assets?page=9')
    await rangeText('Showing 11–12 of 12 assets')
  })
})

describe('Assets page – Find by ID', () => {
  it('"7" navigates to the details page', async () => {
    const { user, location } = renderApp('/assets')
    await user.type(screen.getByLabelText('Find asset by ID'), '7')
    await user.click(screen.getByRole('button', { name: 'Find' }))
    await waitFor(() => expect(location().pathname).toBe('/assets/7'))
  })

  it('"99" shows the not-found error', async () => {
    const { user } = renderApp('/assets')
    await user.type(screen.getByLabelText('Find asset by ID'), '99')
    await user.click(screen.getByRole('button', { name: 'Find' }))
    expect(await screen.findByText('No asset with ID 99.')).toBeInTheDocument()
    expect(screen.getByLabelText('Find asset by ID')).toHaveAttribute('aria-invalid', 'true')
  })

  it('"abc" shows the whole-number error, and empty asks for an ID', async () => {
    const { user } = renderApp('/assets')
    await user.click(screen.getByRole('button', { name: 'Find' }))
    expect(await screen.findByText('Enter an asset ID.')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Find asset by ID'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Find' }))
    expect(await screen.findByText('IDs are whole numbers, like 7.')).toBeInTheDocument()
  })
})

describe('Assets page – Filter by', () => {
  it('Type = Monitor shows only monitors; Status = Available narrows further', async () => {
    const { user, location } = renderApp('/assets')
    await filterMeta('No filters · 12 assets')
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled()

    await user.selectOptions(screen.getByLabelText('Type'), 'MONITOR')
    await filterMeta('1 filter active · 4 results')
    expect(shownIds()).toEqual([4, 5, 9, 11])
    expect(location().search).toBe('?type=MONITOR')

    await user.click(screen.getByRole('button', { name: 'Available' }))
    await filterMeta('2 filters active · 3 results')
    expect(shownIds()).toEqual([5, 9, 11])
    expect(screen.getByRole('button', { name: 'Available' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('Clear filters restores all 12 assets and is then disabled', async () => {
    const { user } = renderApp('/assets?type=MONITOR&condition=FAIR')
    await filterMeta('2 filters active · 1 result')
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    await filterMeta('No filters · 12 assets')
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled()
    expect(screen.getByLabelText('Type')).toHaveValue('')
  })

  it('a filter change returns to page 1', async () => {
    const { user } = renderApp('/assets?page=2')
    await rangeText('Showing 6–10 of 12 assets')
    await user.selectOptions(screen.getByLabelText('Condition'), 'GOOD')
    await rangeText('Showing 1–5 of 6 assets')
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
  })

  it('search is debounced, matches name/serial/employee, and goes into the URL', async () => {
    const { user, location } = renderApp('/assets')
    await rangeText('Showing 1–5 of 12 assets')
    await user.type(screen.getByLabelText('Search'), 'dell')
    expect(location().search).toBe('')
    await filterMeta('1 filter active · 3 results')
    expect(shownIds()).toEqual([1, 4, 10])
    expect(location().search).toBe('?q=dell')
  })

  it('reads filters from the URL on load', async () => {
    renderApp('/assets?q=lama&status=ASSIGNED')
    await filterMeta('2 filters active · 1 result')
    expect(screen.getByLabelText('Search')).toHaveValue('lama')
    expect(shownIds()).toEqual([4])
  })

  it('shows the empty state when nothing matches', async () => {
    renderApp('/assets?q=zzzz')
    expect(await screen.findByText('No assets match')).toBeInTheDocument()
    expect(screen.getByText('Showing 0 assets')).toBeInTheDocument()
  })
})

describe('Dashboard', () => {
  it('shows the stat cards, type bars and needs-attention list', async () => {
    renderApp('/')
    const tile = (label) => screen.getByText(label, { selector: '.tile span' }).nextSibling
    await waitFor(() => expect(tile('Total assets')).toHaveTextContent('12'))
    expect(tile('Available')).toHaveTextContent('4')
    expect(tile('Assigned')).toHaveTextContent('6')
    expect(tile('In repair')).toHaveTextContent('2')
    expect(screen.getByText('Accessories')).toBeInTheDocument()
    expect(screen.getByText('ID 7 · 5CG4142T7M · Damaged')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Jabra Evolve2 65 Headset' })).toHaveAttribute('href', '/assets/12')
  })
})
