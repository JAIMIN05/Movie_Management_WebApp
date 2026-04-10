import { StarRating } from './StarRating'

/**
 * @param {{
 *   movie: { id?: string; title: string; genre: string; year: number; rating: number }
 *   onDelete: (id: string) => void
 *   onEdit?: (movie: object) => void
 *   deleting?: boolean
 * }} props
 */
export function MovieTile({ movie, onDelete, onEdit, deleting = false }) {
  const id = movie.id

  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition motion-safe:duration-200 dark:border-slate-700/90 dark:bg-slate-900 dark:ring-white/5 ${
        deleting
          ? 'scale-[0.99] opacity-70'
          : 'hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:border-indigo-500/35'
      }`}
    >
      <div className={onEdit ? 'pr-24' : 'pr-11'}>
        <h3 className="text-lg font-semibold leading-snug tracking-tight text-slate-900 line-clamp-2 dark:text-slate-50">
          {movie.title}
        </h3>
        <p className="mt-2 inline-flex max-w-full items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
          {movie.genre}
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <span className="text-slate-400 dark:text-slate-500">Year</span>{' '}
          <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-200">
            {movie.year}
          </span>
        </p>
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
        <StarRating value={movie.rating} />
      </div>

      {onEdit ? (
        <button
          type="button"
          onClick={() => id && onEdit(movie)}
          disabled={!id || deleting}
          className="absolute right-11 top-3 rounded-xl p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400"
          title="Edit movie"
          aria-label={`Edit ${movie.title}`}
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => id && onDelete(id)}
        disabled={!id || deleting}
        className="absolute right-2.5 top-3 rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-950/50 dark:hover:text-red-400"
        title="Delete movie"
        aria-label={`Delete ${movie.title}`}
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </article>
  )
}

function PencilIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  )
}
