import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

export default function NotFoundPage() {
  const { pathname } = useLocation()
  return (
    <section className="screen">
      <PageHeader eyebrow="Error 404" title="Page not found" />
      <div className="card empty">
        <b>
          There is no page at <span className="mono" style={{ fontSize: 'inherit' }}>{pathname}</span>.
        </b>
        Use the menu, or go back to a page that exists.
        <p style={{ margin: '16px 0 0', display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          <Link className="btn" to="/">Go to the dashboard</Link>
          <Link className="btn ghost" to="/assets">View assets</Link>
        </p>
      </div>
    </section>
  )
}
