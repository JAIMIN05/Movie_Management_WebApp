import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { MovieFilters } from '../components/MovieFilters'
import { MovieForm } from '../components/MovieForm'
import { MovieList } from '../components/MovieList'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

const SEARCH_DEBOUNCE_MS = 400

export function MoviesPage() {
  const [reloadToken, setReloadToken] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  /** Movie being edited, or null for “add” mode */
  const [editingMovie, setEditingMovie] = useState(null)

  const [searchTitle, setSearchTitle] = useState('')
  const debouncedTitle = useDebouncedValue(searchTitle, SEARCH_DEBOUNCE_MS)
  const [filterGenre, setFilterGenre] = useState('')
  const [filterYear, setFilterYear] = useState('')

  const hasActiveFilters = useMemo(() => {
    return (
      debouncedTitle.trim() !== '' ||
      filterGenre.trim() !== '' ||
      filterYear.trim() !== ''
    )
  }, [debouncedTitle, filterGenre, filterYear])

  const clearFilters = () => {
    const had =
      searchTitle.trim() !== '' ||
      filterGenre.trim() !== '' ||
      filterYear.trim() !== ''
    setSearchTitle('')
    setFilterGenre('')
    setFilterYear('')
    if (had) {
      toast.success('Filters cleared', { id: 'filters-clear' })
    }
  }

  const openAdd = () => {
    setEditingMovie(null)
    setFormOpen(true)
  }

  const openEdit = (movie) => {
    setEditingMovie(movie)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingMovie(null)
  }

  const handleFormSuccess = (movie) => {
    const wasEdit = Boolean(editingMovie?.id)
    const name = movie?.title ?? 'Movie'
    toast.success(wasEdit ? `"${name}" updated` : `"${name}" added`, {
      id: wasEdit ? 'movie-updated' : 'movie-added',
    })
    setReloadToken((n) => n + 1)
    closeForm()
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Movies
          </h2>
          <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Search, filter, paginate, and curate your collection — synced with
            your Go API and MongoDB.
          </p>
        </div>
        {!formOpen ? (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.98]"
          >
            Add movie
          </button>
        ) : null}
      </div>

      {formOpen ? (
        <MovieForm
          initialMovie={editingMovie}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
        />
      ) : null}

      {!formOpen ? (
        <MovieFilters
          title={searchTitle}
          onTitleChange={setSearchTitle}
          genre={filterGenre}
          onGenreChange={setFilterGenre}
          year={filterYear}
          onYearChange={setFilterYear}
          onClear={clearFilters}
        />
      ) : null}

      <MovieList
        reloadToken={reloadToken}
        onEditMovie={openEdit}
        filterTitle={debouncedTitle}
        filterGenre={filterGenre}
        filterYear={filterYear}
        hasActiveFilters={hasActiveFilters}
        filterSignature={`${debouncedTitle}|${filterGenre}|${filterYear}`}
      />
    </div>
  )
}
