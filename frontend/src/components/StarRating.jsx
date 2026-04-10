const MAX = 5

/**
 * @param {{ value: number; className?: string }} props
 */
export function StarRating({ value, className = '' }) {
  const rounded = Math.min(MAX, Math.max(0, Math.round(Number(value) || 0)))

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      aria-label={`Rating ${value} out of ${MAX}`}
    >
      <span className="flex text-lg leading-none text-amber-400" aria-hidden>
        {Array.from({ length: MAX }, (_, i) => (
          <span
            key={i}
            className={
              i < rounded
                ? 'text-amber-500 drop-shadow-sm dark:text-amber-400'
                : 'text-slate-200 dark:text-slate-600'
            }
          >
            ★
          </span>
        ))}
      </span>
      <span className="text-sm font-medium text-slate-600 tabular-nums dark:text-slate-400">
        {Number(value).toFixed(1)}
      </span>
    </div>
  )
}
