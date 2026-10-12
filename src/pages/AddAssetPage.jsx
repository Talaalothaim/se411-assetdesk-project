import { useNavigate } from 'react-router-dom'
import AssetForm from '../components/AssetForm.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useToast } from '../components/ToastContext.js'
import { DEFAULT_PAGE_SIZE } from '../data/constants.js'
import useGoBack from '../hooks/useGoBack.js'
import { createAsset, getAssets } from '../services/assetService.js'

export default function AddAssetPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const goBack = useGoBack('/assets')

  async function handleSubmit(values) {
    const created = await createAsset(values)
    // New assets get the highest id, so they land on the last page of the unfiltered list.
    const { totalPages } = await getAssets({ size: DEFAULT_PAGE_SIZE })
    showToast(`Asset added with ID ${created.id}`)
    navigate(totalPages > 1 ? `/assets?page=${totalPages}` : '/assets')
  }

  return (
    <section className="screen">
      <PageHeader eyebrow="Inventory · New" title="Add a new asset" />
      <AssetForm submitLabel="Add asset" onSubmit={handleSubmit} onCancel={goBack} />
    </section>
  )
}
