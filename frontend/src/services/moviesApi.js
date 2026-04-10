import { api } from './api'

/**
 * Movie CRUD — all calls use the shared Axios instance (`api`) from `./api`.
 *
 * - GET    /movies     → list (optional query: title, genre, year, page, limit)
 * - POST   /movies     → create
 * - PUT    /movies/:id → update
 * - DELETE /movies/:id → delete
 */

/**
 * @param {Record<string, string | number | undefined>} [params]
 */
export async function fetchMovies(params) {
  const { data } = await api.get('/movies', { params })
  return data
}

/**
 * @param {{ title: string; genre: string; year: number; rating: number }} payload
 */
export async function createMovie(payload) {
  const { data } = await api.post('/movies', payload)
  return data
}

/**
 * @param {string} id
 * @param {{ title: string; genre: string; year: number; rating: number }} payload
 */
export async function updateMovie(id, payload) {
  const { data } = await api.put(`/movies/${id}`, payload)
  return data
}

export async function deleteMovie(id) {
  const { data } = await api.delete(`/movies/${id}`)
  return data
}
