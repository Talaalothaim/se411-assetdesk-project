import { useEffect, useId, useRef } from 'react'

/**
 * Modal confirm dialog (replaces window.confirm). Focuses Cancel on open,
 * keeps Tab inside the dialog, closes on Escape or backdrop click, and
 * returns focus to where it was.
 */
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Delete',
  busyLabel = 'Deleting…',
  busy = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  const titleId = useId()
  const bodyId = useId()
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)
  const onCancelRef = useRef(onCancel)
  const busyRef = useRef(busy)

  useEffect(() => {
    onCancelRef.current = onCancel
    busyRef.current = busy
  })

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    cancelRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (!busyRef.current) onCancelRef.current()
      } else if (e.key === 'Tab') {
        const items = [...dialogRef.current.querySelectorAll('button:not(:disabled)')]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous?.isConnected) previous.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel()
      }}
    >
      <div
        ref={dialogRef}
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
      >
        <h2 id={titleId}>{title}</h2>
        <p id={bodyId}>{children}</p>
        {error && <p className="err" role="alert" style={{ marginTop: -12 }}>{error}</p>}
        <div className="row">
          <button ref={cancelRef} type="button" className="btn ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn red" onClick={onConfirm} disabled={busy}>
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
