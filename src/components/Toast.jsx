import { useCallback, useEffect, useState } from 'react'
import { ToastContext } from './ToastContext.js'

const TOAST_MS = 2600

/** Provides showToast(message) and renders the bottom-right toast. */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message) => {
    setToast({ message, key: Date.now() + Math.random() })
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), TOAST_MS)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast" role="status" aria-live="polite" hidden={!toast}>
        {toast && (
          <>
            <span aria-hidden="true">✓</span>
            {toast.message}
          </>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
