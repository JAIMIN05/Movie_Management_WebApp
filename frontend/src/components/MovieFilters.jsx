const currentYear = new Date().getFullYear()

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500'

/**
 * @param {{
 *   title: string
 *   onTitleChange: (v: string) => void
 *   genre: string
 *   onGenreChange: (v: string) => void
 *   year: string
 *   onYearChange: (v: string) => void
 *   onClear: () => void
 * }} props
 */
export function MovieFilters({
  title,
  onTitleChange,
  genre,
  onGenreChange,
  year,
  onYearChange,
  onClear,
}) {
  const hasAny =
    title.trim() !== '' || genre.trim() !== '' || year.trim() !== ''

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-5 dark:border-slate-700/90 dark:bg-slate-900 dark:ring-white/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Search &amp; filter
          </h3>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Title search is debounced so the API runs after you pause typing.
            Genre and year apply on change.
          </p>
        </div>
        {hasAny ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block sm:col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Search title
          </span>
          <input
            type="search"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Partial match…"
            className={`${inputClass} mt-1.5`}
            autoComplete="off"
            aria-describedby="search-debounce-hint"
          />
          <span id="search-debounce-hint" className="sr-only">
            Results update shortly after you stop typing.
          </span>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Genre
          </span>
          <input
            type="text"
            value={genre}
            onChange={(e) => onGenreChange(e.target.value)}
            placeholder="Exact (case-insensitive)"
            className={`${inputClass} mt-1.5`}
            autoComplete="off"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Year
          </span>
          <input
            type="number"
            min={1900}
            max={currentYear}
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            placeholder="e.g. 2020"
            className={`${inputClass} mt-1.5`}
          />
        </label>
      </div>
    </div>
  )
}
