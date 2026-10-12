import { useEffect } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import App from '../App.jsx'
import { ROUTER_FUTURE } from '../routerFuture.js'

/** Reports every router location change to `onChange`. */
function LocationSpy({ onChange }) {
  const location = useLocation()
  useEffect(() => {
    onChange(location)
  }, [onChange, location])
  return null
}

/** Renders the whole app at `path`. Returns RTL helpers, a userEvent instance and location(). */
export function renderApp(path = '/') {
  const user = userEvent.setup()
  let current = null
  const track = (location) => {
    current = location
  }
  const utils = render(
    <MemoryRouter initialEntries={[path]} future={ROUTER_FUTURE}>
      <App />
      <LocationSpy onChange={track} />
    </MemoryRouter>,
  )
  return { user, ...utils, location: () => current }
}
