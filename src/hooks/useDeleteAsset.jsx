import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { useToast } from '../components/ToastContext.js'
import { deleteAsset } from '../services/assetService.js'

/**
 * Delete flow shared by the list and details pages.
 * Returns `askDelete(asset)` to open the confirm dialog and the `dialog` element to render.
 * `onDeleted(asset)` runs after a successful delete.
 */
export default function useDeleteAsset(onDeleted) {
  const showToast = useToast()
  const [target, setTarget] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const askDelete = (asset) => {
    setError('')
    setTarget(asset)
  }

  const cancel = () => setTarget(null)

  const confirm = async () => {
    const asset = target
    setBusy(true)
    try {
      await deleteAsset(asset.id)
      setTarget(null)
      showToast(`${asset.deviceName} deleted`)
      onDeleted?.(asset)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const dialog = (
    <ConfirmDialog
      open={target !== null}
      title="Delete this asset?"
      busy={busy}
      error={error}
      onConfirm={confirm}
      onCancel={cancel}
    >
      <b>{target?.deviceName}</b> will be removed from the inventory. This can’t be undone.
    </ConfirmDialog>
  )

  return { askDelete, dialog }
}
