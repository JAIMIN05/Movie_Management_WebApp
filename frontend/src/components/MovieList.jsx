import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { deleteMovie, fetchMovies } from '../services/moviesApi'
import { parseApiError } from '../services/parseApiError'
import { MovieGridSkeleton } from './MovieGridSkeleton'
import { MoviePagination } from './MoviePagination'
import { MovieTile } from './MovieTile'
import { RefreshBar } from './RefreshBar'

const PAGE_SIZE = 9

function buildListParams(filterTitle, filterGenre, filterYear, page, limit) {
  const params = { page, limit }
  const t = filterTitle.trim()
  if (t) params.title = t
  const g = filterGenre.trim()
  if (g) params.genre = g
  const y = filterYear.trim()
  if (y !== '') {
    const n = parseInt(y, 10)
    if (!Number.isNaN(n)) params.year = n
  }
  return params
}

/**
 * @param {{
 *   reloadToken?: number
 *   onEditMovie?: (movie: object) => void
 *   filterTitle?: string
 *   filterGenre?: string
 *   filterYear?: string
 *   hasActiveFilters?: boolean
 *   filterSignature?: string
 * }} props
 */
export function MovieList({
  reloadToken = 0,
  onEditMovie,
  filterTitle = '',
  filterGenre = '',
  filterYear = '',
  hasActiveFilters = false,
  filterSignature = '',
}) {
  const [movies, setMovies] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const isFirstFetch = useRef(true)

  useLayoutEffect(() => {
    setPage(1)
  }, [reloadToken, filterSignature])

  const load = useCallback(async () => {
    const silent = !isFirstFetch.current
    if (silent) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setLoadError(null)

    try {
      const params = buildListParams(
        filterTitle,
        filterGenre,
        filterYear,
        page,
        PAGE_SIZE,
      )
      const data = await fetchMovies(params)
      const totalCount = Number(data.total) || 0
      const limitFromApi = Number(data.limit) || PAGE_SIZE
      const totalPages = Math.max(1, Math.ceil(totalCount / limitFromApi))

      if (page > totalPages) {
        setPage(totalPages)
        return
      }

      setMovies(Array.isArray(data.movies) ? data.movies : [])
      setTotal(totalCount)
    } catch (e) {
      const message = parseApiError(
        e,
        'Could not load movies. Is the API running?',
      )
      if (silent) {
        toast.error(message, { id: 'movies-refresh' })
      } else {
        setMovies([])
        setTotal(0)
        setLoadError(message)
        toast.error(message, { id: 'movies-load' })
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
      isFirstFetch.current = false
    }
  }, [filterTitle, filterGenre, filterYear, page])

  useEffect(() => {
    load()
  }, [load, reloadToken])

  const refetchCurrentPage = useCallback(async () => {
    try {
      const params = buildListParams(
        filterTitle,
        filterGenre,
        filterYear,
        page,
        PAGE_SIZE,
      )
      const data = await fetchMovies(params)
      const list = Array.isArray(data.movies) ? data.movies : []
      const totalCount = Number(data.total) || 0
      const limitFromApi = Number(data.limit) || PAGE_SIZE
      const totalPages = Math.max(1, Math.ceil(totalCount / limitFromApi))

      if (page > totalPages) {
        setPage(totalPages)
        return
      }
      setMovies(list)
      setTotal(totalCount)
    } catch (e) {
      toast.error(parseApiError(e, 'Could not refresh list'), {
        id: 'movies-refetch',
      })
    }
  }, [filterTitle, filterGenre, filterYear, page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie?')) return
    setDeletingId(id)
    try {
      await deleteMovie(id)
      await refetchCurrentPage()
      toast.success('Movie removed', { id: 'movie-delete' })
    } catch (e) {
      toast.error(parseApiError(e, 'Failed to delete movie'), {
        id: 'movie-delete-err',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  if (loading) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500 dark:text-slate-400" role="status">
          Loading your library…
        </p>
        <MovieGridSkeleton count={PAGE_SIZE} />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-200/90 bg-red-50/95 p-6 shadow-sm dark:border-red-900/60 dark:bg-red-950/35">
        <p className="font-semibold text-red-900 dark:text-red-100">
          Could not load movies
        </p>
        <p className="mt-2 text-sm text-red-800/90 dark:text-red-200/90">
          {loadError}
        </p>
        <button
          type="button"
          onClick={() => {
            isFirstFetch.current = true
            load()
          }}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {refreshing && movies.length > 0 ? <RefreshBar /> : null}

      {movies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300/90 bg-slate-50/80 px-6 py-14 text-center dark:border-slate-600 dark:bg-slate-900/40">
          <p className="mx-auto max-w-md text-slate-600 dark:text-slate-400">
            {hasActiveFilters ? (
              <>
                No movies match your search or filters. Try different values or
                use{' '}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  Clear filters
                </strong>{' '}
                above.
              </>
            ) : (
              <>
                No movies yet. Use{' '}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  Add movie
                </strong>{' '}
                above to create one.
              </>
            )}
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
            refreshing ? 'pointer-events-none opacity-60' : ''
          } motion-safe:transition-opacity motion-safe:duration-200`}
          role="list"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-0" role="listitem">
              <MovieTile
                movie={movie}
                onDelete={handleDelete}
                onEdit={onEditMovie}
                deleting={deletingId === movie.id}
              />
            </div>
          ))}
        </div>
      )}

      {total > 0 ? (
        <MoviePagination
          page={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          disabled={refreshing}
        />
      ) : null}
    </div>
  )
}
