import { LogoIcon, MenuIcon } from './Icons.jsx'

export default function TopBar({ menuOpen, onToggleMenu }) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="burger"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-controls="side"
        aria-expanded={menuOpen}
        onClick={onToggleMenu}
      >
        <MenuIcon />
      </button>
      <div className="brand">
        <div className="logo"><LogoIcon /></div>
        <div>
          <b>AssetDesk</b>
          <small>IT Asset Management</small>
        </div>
      </div>
    </header>
  )
}
