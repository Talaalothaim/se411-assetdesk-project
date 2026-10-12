import { useLocation, useNavigate } from 'react-router-dom'

/** Returns a function that goes to the previous page, or to `fallback` if there is none. */
export default function useGoBack(fallback) {
  const navigate = useNavigate()
  const location = useLocation()
  return () => {
    // 'default' is the key of the first entry, i.e. the app was opened on this page.
    if (location.key !== 'default') navigate(-1)
    else navigate(fallback)
  }
}
