import { screen, waitFor, within } from '@testing-library/react'
import { renderApp } from './renderApp.jsx'

// Pretend to be a phone: the (max-width: 899px) query matches.
const realMatchMedia = window.matchMedia
beforeEach(() => {
  window.matchMedia = (query) => ({
    matches: query.includes('899px'),
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })
})
afterEach(() => {
  window.matchMedia = realMatchMedia
})

const burger = () => within(screen.getByRole('banner')).getByRole('button')
const appRoot = (container) => container.querySelector('.app')

function open(user) {
  return user.click(screen.getByRole('button', { name: 'Open menu' }))
}

describe('Phone drawer (< 900px)', () => {
  it('starts closed and opens with the hamburger', async () => {
    const { user, container } = renderApp('/about')
    expect(burger()).toHaveAttribute('aria-expanded', 'false')
    expect(appRoot(container)).not.toHaveClass('open')
    await open(user)
    expect(burger()).toHaveAttribute('aria-expanded', 'true')
    expect(burger()).toHaveAccessibleName('Close menu')
    expect(appRoot(container)).toHaveClass('open')
  })

  it('closes on Escape', async () => {
    const { user, container } = renderApp('/about')
    await open(user)
    await user.keyboard('{Escape}')
    expect(appRoot(container)).not.toHaveClass('open')
    expect(burger()).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes on a backdrop click', async () => {
    const { user, container } = renderApp('/about')
    await open(user)
    await user.click(container.querySelector('.drawer-scrim'))
    expect(appRoot(container)).not.toHaveClass('open')
  })

  it("closes with the drawer's close button", async () => {
    const { user, container } = renderApp('/about')
    await open(user)
    const side = screen.getByRole('complementary', { name: 'Menu' })
    await user.click(within(side).getByRole('button', { name: 'Close menu' }))
    expect(appRoot(container)).not.toHaveClass('open')
  })

  it('closes after choosing a menu item, and navigates', async () => {
    const { user, container, location } = renderApp('/about')
    await open(user)
    await user.click(screen.getByRole('link', { name: 'Assets' }))
    await waitFor(() => expect(location().pathname).toBe('/assets'))
    expect(appRoot(container)).not.toHaveClass('open')
    expect(await screen.findByText('Showing 1–5 of 12 assets')).toBeInTheDocument()
  })
})
