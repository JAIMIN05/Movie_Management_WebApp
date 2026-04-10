/**
 * Turns an Axios/network error into a short message for the UI.
 * @param {unknown} err
 * @param {string} [fallback]
 */
export function parseApiError(err, fallback = 'Something went wrong') {
  if (err && typeof err === 'object' && 'response' in err) {
    const data = err.response?.data
    if (data && typeof data === 'object' && 'error' in data && data.error) {
      return String(data.error)
    }
    const status = err.response?.status
    if (status === 404) return 'Not found'
    if (status === 409) return 'Conflict — maybe a duplicate?'
  }
  if (err && typeof err === 'object' && 'code' in err && err.code === 'ERR_NETWORK') {
    return 'Cannot reach the server. Is the API running on port 8080?'
  }
  if (err && typeof err === 'object' && 'message' in err && err.message) {
    return String(err.message)
  }
  return fallback
}
