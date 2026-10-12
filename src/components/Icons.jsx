// Inline SVG icons taken from the mockup. All are decorative (aria-hidden).
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'aria-hidden': true,
  focusable: false,
}

export function MenuIcon() {
  return (
    <svg width="22" height="22" strokeWidth="2" strokeLinecap="round" {...base}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg width="20" height="20" strokeWidth="2" strokeLinecap="round" {...base}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function LogoIcon() {
  return (
    <svg width="17" height="17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...base}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  )
}

export function DashboardIcon() {
  return (
    <svg width="18" height="18" strokeWidth="1.8" strokeLinejoin="round" {...base}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  )
}

export function ListIcon() {
  return (
    <svg width="18" height="18" strokeWidth="1.8" strokeLinecap="round" {...base}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

export function PlusIcon() {
  return (
    <svg width="18" height="18" strokeWidth="1.8" strokeLinecap="round" {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

export function TeamIcon() {
  return (
    <svg width="18" height="18" strokeWidth="1.8" strokeLinecap="round" {...base}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.4 3.4-5.5 6.5-5.5s5.7 2.1 6.5 5.5" />
      <circle cx="17.5" cy="9" r="2.5" />
      <path d="M17 14.5c2.3.2 4 1.9 4.5 4.5" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg width="18" height="18" strokeWidth="2" strokeLinecap="round" {...base}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

export function EditIcon() {
  return (
    <svg width="17" height="17" strokeWidth="1.8" strokeLinejoin="round" {...base}>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
    </svg>
  )
}

export function TrashIcon() {
  return (
    <svg width="17" height="17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...base}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  )
}
