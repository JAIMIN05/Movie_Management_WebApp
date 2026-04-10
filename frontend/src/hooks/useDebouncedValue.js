import { useEffect, useState } from 'react'

/**
 * Returns `value` only after it stops changing for `delayMs` milliseconds.
 * @template T
 * @param {T} value
 * @param {number} delayMs
 */
export function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
