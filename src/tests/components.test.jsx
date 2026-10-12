import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '../components/Pagination.jsx'
import StatusChip from '../components/StatusChip.jsx'
import { ToastProvider } from '../components/Toast.jsx'
import { useToast } from '../components/ToastContext.js'
import { resetStore } from '../services/assetService.js'
import { formatDate } from '../utils/format.js'
import { renderApp } from './renderApp.jsx'

describe('formatDate', () => {
  it('formats ISO dates like the mockup', () => {
    expect(formatDate('2025-02-14')).toBe('14 Feb 2025')
    expect(formatDate('2026-09-01')).toBe('1 Sep 2026')
    expect(formatDate('')).toBe('—')
  })
})

describe('StatusChip', () => {
  it('shows the label and uses the code as its class', () => {
    render(<StatusChip status="IN_REPAIR" />)
    expect(screen.getByText('In Repair')).toHaveClass('chip', 'IN_REPAIR')
  })
})

describe('Pagination', () => {
  const props = { size: 5, totalElements: 12, totalPages: 3, onPageChange: vi.fn(), onSizeChange: vi.fn() }

  it('disables Prev on the first page and Next on the last', () => {
    const { rerender } = render(<Pagination {...props} page={0} shown={5} />)
    expect(screen.getByText('Showing 1–5 of 12 assets')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled()

    rerender(<Pagination {...props} page={2} shown={2} />)
    expect(screen.getByText('Showing 11–12 of 12 assets')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current')
  })

  it('reports page and size changes', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const onSizeChange = vi.fn()
    render(<Pagination {...props} page={0} shown={5} onPageChange={onPageChange} onSizeChange={onSizeChange} />)
    await user.click(screen.getByRole('button', { name: 'Page 2' }))
    expect(onPageChange).toHaveBeenCalledWith(1)
    await user.selectOptions(screen.getByLabelText('Rows per page'), '10')
    expect(onSizeChange).toHaveBeenCalledWith(10)
  })

  it('shows "Showing 0 assets" when empty', () => {
    render(<Pagination {...props} page={0} shown={0} totalElements={0} totalPages={0} />)
    expect(screen.getByText('Showing 0 assets')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })
})

describe('Toast', () => {
  function Trigger() {
    const showToast = useToast()
    return <button onClick={() => showToast('Saved')}>Go</button>
  }

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the message in a status region and hides it after ~2.6 s', () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    const region = screen.getByRole('status', { hidden: true })
    expect(region).not.toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(region).toBeVisible()
    expect(region).toHaveTextContent('✓Saved')

    act(() => vi.advanceTimersByTime(2500))
    expect(region).toBeVisible()
    act(() => vi.advanceTimersByTime(200))
    expect(region).not.toBeVisible()
  })
})

describe('Loading state', () => {
  beforeEach(() => resetStore())

  it('shows a loading message while the service promise is pending', async () => {
    renderApp('/assets')
    expect(screen.getByText('Loading assets…')).toBeInTheDocument()
    expect(await screen.findByText('Showing 1–5 of 12 assets')).toBeInTheDocument()
    expect(screen.queryByText('Loading assets…')).not.toBeInTheDocument()
  })
})
