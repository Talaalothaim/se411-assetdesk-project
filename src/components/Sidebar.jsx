import { Link, useLocation } from 'react-router-dom'
import { CloseIcon, DashboardIcon, ListIcon, LogoIcon, PlusIcon, TeamIcon } from './Icons.jsx'

const ITEMS = [
  { to: '/', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/assets', label: 'Assets', Icon: ListIcon },
  { to: '/assets/new', label: 'Add Asset', Icon: PlusIcon },
  { to: '/about', label: 'About', Icon: TeamIcon },
]

/** Which menu item is active. Assets stays active on details and edit pages. */
function activeItem(pathname) {
  if (pathname === '/') return '/'
  if (pathname === '/assets/new') return '/assets/new'
  if (pathname === '/assets' || pathname.startsWith('/assets/')) return '/assets'
  if (pathname === '/about') return '/about'
  return null
}

export default function Sidebar({ hidden, onClose, onNavigate }) {
  const { pathname } = useLocation()
  const active = activeItem(pathname)

  return (
    <aside className="side" id="side" aria-label="Menu" inert={hidden ? '' : undefined}>
      <div className="drawer-brand">
        <div className="brand">
          <div className="logo"><LogoIcon /></div>
          <div><b>AssetDesk</b></div>
        </div>
        <button type="button" className="burger" aria-label="Close menu" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <p className="side-label">Menu</p>
      <nav aria-label="Main menu">
        {ITEMS.map(({ to, label, Icon }) => {
          const on = active === to
          return (
            <Link
              key={to}
              to={to}
              className={on ? 'nav on' : 'nav'}
              aria-current={on ? 'page' : undefined}
              onClick={onNavigate}
            >
              <Icon />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="side-note">
        <b>SE411 · Project</b>
        Part 1: data in memory.
        <br />
        Part 2: Spring REST API.
      </div>
    </aside>
  )
}
