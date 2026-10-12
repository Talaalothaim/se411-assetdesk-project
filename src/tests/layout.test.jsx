import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { ROUTER_FUTURE } from '../routerFuture.js'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]} future={ROUTER_FUTURE}>
      <App />
    </MemoryRouter>,
  )
}

describe('Layout', () => {
  it('shows the four menu items', () => {
    renderAt('/about')
    const nav = screen.getByRole('navigation', { name: 'Main menu' })
    for (const label of ['Dashboard', 'Assets', 'Add Asset', 'About']) {
      expect(nav).toHaveTextContent(label)
    }
  })

  it('hamburger toggles aria-expanded and its label', async () => {
    const user = userEvent.setup()
    renderAt('/about')
    const burger = screen.getByRole('button', { name: 'Close menu', expanded: true })
    await user.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'false')
    expect(burger).toHaveAccessibleName('Open menu')
    await user.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps Assets active on details and edit pages, but not on Add Asset', () => {
    const { unmount } = renderAt('/assets/7/edit')
    expect(screen.getByRole('link', { name: 'Assets' })).toHaveAttribute('aria-current', 'page')
    unmount()
    renderAt('/assets/new')
    expect(screen.getByRole('link', { name: 'Add Asset' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Assets' })).not.toHaveAttribute('aria-current')
  })

  it('clicking About shows the team table with all three names and student IDs', async () => {
    const user = userEvent.setup()
    renderAt('/assets/new')
    await user.click(screen.getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { name: 'About the team' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')

    const rows = within(screen.getByRole('table', { name: 'Team members' })).getAllByRole('row').slice(1)
    expect(rows.map((r) => r.textContent)).toEqual([
      '1Tala Alothaim223410047',
      '2Reema Alsabhan222511316',
      '3Norah Aljasser222410205',
    ])
    expect(screen.getByText('React · Spring Boot')).toBeInTheDocument()
    expect(screen.getByText('Prince Sultan University')).toBeInTheDocument()
  })

  it('shows the not-found page for unknown routes', () => {
    renderAt('/nope')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByText('/nope')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to the dashboard' })).toHaveAttribute('href', '/')
  })
})
