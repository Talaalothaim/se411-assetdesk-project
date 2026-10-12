import { Link } from 'react-router-dom'
import PageHeader from './PageHeader.jsx'

/** Friendly message for an asset that could not be loaded (usually a 404). */
export default function AssetLoadError({ id, error }) {
  const notFound = error.status === 404
  return (
    <section className="screen">
      <PageHeader eyebrow={`Asset ID ${id}`} title={notFound ? 'Asset not found' : 'Could not load asset'}>
        <Link className="btn ghost" to="/assets">← Back to assets</Link>
      </PageHeader>
      <div className="card empty" role="alert">
        <b>{notFound ? `No asset with ID ${id}.` : error.message}</b>
        {notFound
          ? 'It may have been deleted, or the link is wrong.'
          : 'Please try again in a moment.'}
        <p style={{ margin: '16px 0 0' }}>
          <Link to="/assets">Go to the assets list</Link>
        </p>
      </div>
    </section>
  )
}
