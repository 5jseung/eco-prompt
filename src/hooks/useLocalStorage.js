import { useEffect, useState } from 'react'

// Tiny localStorage-backed useState. Safe on SSR / when storage is blocked.
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = window.localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* quota exceeded / private mode — ignore */
    }
  }, [key, value])

  return [value, setValue]
}
