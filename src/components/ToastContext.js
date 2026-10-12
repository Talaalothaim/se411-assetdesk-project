import { createContext, useContext } from 'react'

/** Holds the `showToast(message)` function provided by <ToastProvider>. */
export const ToastContext = createContext(() => {})

/** Returns `showToast(message)`. */
export function useToast() {
  return useContext(ToastContext)
}
