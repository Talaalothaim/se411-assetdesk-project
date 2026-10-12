import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import { ToastProvider } from './components/Toast.jsx'
import useMediaQuery, { NARROW_QUERY } from './hooks/useMediaQuery.js'
import DashboardPage from './pages/DashboardPage.jsx'
import AssetsPage from './pages/AssetsPage.jsx'
import AssetDetailsPage from './pages/AssetDetailsPage.jsx'
import AddAssetPage from './pages/AddAssetPage.jsx'
import EditAssetPage from './pages/EditAssetPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  const narrow = useMediaQuery(NARROW_QUERY)
  // Wide screens: sidebar is pinned and open by default. Phones: drawer starts closed.
  const [pinnedOpen, setPinnedOpen] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuOpen = narrow ? drawerOpen : pinnedOpen
  const { pathname } = useLocation()

  const setMenu = (open) => (narrow ? setDrawerOpen(open) : setPinnedOpen(open))
  const closeDrawer = () => setDrawerOpen(false)

  // Crossing the breakpoint always leaves the phone drawer closed.
  const [prevNarrow, setPrevNarrow] = useState(narrow)
  if (prevNarrow !== narrow) {
    setPrevNarrow(narrow)
    setDrawerOpen(false)
  }

  // Escape closes the phone drawer.
  useEffect(() => {
    if (!narrow || !drawerOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [narrow, drawerOpen])

  // New page → back to the top.
  useEffect(() => {
    window.scrollTo?.(0, 0)
  }, [pathname])

  const appClass = ['app', narrow && drawerOpen && 'open', !narrow && !pinnedOpen && 'closed']
    .filter(Boolean)
    .join(' ')

  return (
    <ToastProvider>
      <div className={appClass}>
        <TopBar menuOpen={menuOpen} onToggleMenu={() => setMenu(!menuOpen)} />
        <div className="drawer-scrim" onClick={closeDrawer} aria-hidden="true" />
        <div className="shell">
          <Sidebar
            hidden={!menuOpen}
            onClose={() => setMenu(false)}
            onNavigate={narrow ? closeDrawer : undefined}
          />
          <main>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/assets/new" element={<AddAssetPage />} />
              <Route path="/assets/:id" element={<AssetDetailsPage />} />
              <Route path="/assets/:id/edit" element={<EditAssetPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
