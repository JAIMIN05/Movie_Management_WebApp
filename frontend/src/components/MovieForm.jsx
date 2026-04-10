import { useEffect, useState } from 'react'
import { createMovie, updateMovie } from '../services/moviesApi'
import { parseApiError } from '../services/parseApiError'

const currentYear = new Date().getFullYear()

/**
 * @typedef {{ title?: string; genre?: string; year?: string; rating?: string; _form?: string }} FieldErrors
 */

/**
 * @param {{
 *   initialMovie: { id?: string; title?: string; genre?: string; year?: number; rating?: number } | null
 *   onSuccess: (movie: object) => void
 *   onCancel: () => void
 * }} props
 */
export function MovieForm({ initialMovie, onSuccess, onCancel }) {
  const isEdit = Boolean(initialMovie?.id)

  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [rating, setRating] = useState('')
  const [errors, setErrors] = useState(/** @type {FieldErrors} */ ({}))
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initialMovie) {
      setTitle(initialMovie.title ?? '')
      setGenre(initialMovie.genre ?? '')
      setYear(
        initialMovie.year != null ? String(initialMovie.year) : '',
      )
      setRating(
        initialMovie.rating != null ? String(initialMovie.rating) : '',
      )
    } else {
      setTitle('')
      setGenre('')
      setYear('')
      setRating('')
    }
    setErrors({})
  }, [initialMovie])

  const validate = () => {
    /** @type {FieldErrors} */
    const next = {}

    const t = title.trim()
    const g = genre.trim()
    if (!t) next.title = 'Title is required'
    if (!g) next.genre = 'Genre is required'

    const y = parseInt(year, 10)
    if (year.trim() === '' || Number.isNaN(y)) {
      next.year = 'Enter a valid year'
    } else if (y < 1900 || y > currentYear) {
      next.year = `Year must be between 1900 and ${currentYear}`
    }

    const r = parseFloat(rating)
    if (rating.trim() === '' || Number.isNaN(r)) {
      next.rating = 'Enter a valid rating'
    } else if (r < 0 || r > 5) {
      next.rating = 'Rating must be between 0 and 5'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setErrors((prev) => ({ ...prev, _form: undefined }))

    const payload = {
      title: title.trim(),
      genre: genre.trim(),
      year: parseInt(year, 10),
      rating: parseFloat(rating),
    }

    try {
      const saved = isEdit
        ? await updateMovie(initialMovie.id, payload)
        : await createMovie(payload)
      onSuccess(saved)
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.error

      if (status === 409 && msg) {
        setErrors({ title: String(msg) })
      } else if (status === 400 && msg) {
        setErrors({ _form: String(msg) })
      } else {
        setErrors({
          _form: parseApiError(
            err,
            isEdit ? 'Could not update movie' : 'Could not create movie',
          ),
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100'

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-900/5 sm:p-8 dark:border-slate-700/90 dark:bg-slate-900 dark:ring-white/5"
      noValidate
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
        {isEdit ? 'Edit movie' : 'Add movie'}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        All fields are required. Rating must be between 0 and 5.
      </p>

      {errors._form ? (
        <p
          className="mt-5 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {errors._form}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </span>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${inputClass} ${errors.title ? 'border-red-500' : ''}`}
            autoComplete="off"
            disabled={submitting}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'err-title' : undefined}
          />
          {errors.title ? (
            <span id="err-title" className="mt-1 block text-sm text-red-600">
              {errors.title}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Genre
          </span>
          <input
            type="text"
            name="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={`${inputClass} ${errors.genre ? 'border-red-500' : ''}`}
            disabled={submitting}
            aria-invalid={Boolean(errors.genre)}
          />
          {errors.genre ? (
            <span className="mt-1 block text-sm text-red-600">{errors.genre}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Year
          </span>
          <input
            type="number"
            name="year"
            min={1900}
            max={currentYear}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`${inputClass} ${errors.year ? 'border-red-500' : ''}`}
            disabled={submitting}
            aria-invalid={Boolean(errors.year)}
          />
          {errors.year ? (
            <span className="mt-1 block text-sm text-red-600">{errors.year}</span>
          ) : null}
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Rating (0–5)
          </span>
          <input
            type="number"
            name="rating"
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className={`${inputClass} ${errors.rating ? 'border-red-500' : ''}`}
            disabled={submitting}
            aria-invalid={Boolean(errors.rating)}
          />
          {errors.rating ? (
            <span className="mt-1 block text-sm text-red-600">{errors.rating}</span>
          ) : null}
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] min-w-[8rem] items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add movie'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
