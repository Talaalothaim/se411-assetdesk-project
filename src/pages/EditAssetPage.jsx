import { useNavigate, useParams } from 'react-router-dom'
import AssetForm from '../components/AssetForm.jsx'
import AssetLoadError from '../components/AssetLoadError.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useToast } from '../components/ToastContext.js'
import { useAsset } from '../hooks/useAssets.js'
import useGoBack from '../hooks/useGoBack.js'
import { updateAsset } from '../services/assetService.js'

export default function EditAssetPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()
  const goBack = useGoBack(`/assets/${id}`)
  const { data: asset, error } = useAsset(id)

  if (error) return <AssetLoadError id={id} error={error} />

  async function handleSubmit(values) {
    const updated = await updateAsset(asset.id, values)
    showToast('Asset updated')
    navigate(`/assets/${updated.id}`)
  }

  return (
    <section className="screen" aria-busy={!asset}>
      <PageHeader eyebrow={`Inventory · Edit · ID ${id}`} title="Edit asset" />
      {asset ? (
        <AssetForm
          key={asset.id}
          initialValues={asset}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={goBack}
        />
      ) : (
        <div className="card loading" role="status">Loading asset…</div>
      )}
    </section>
  )
}
