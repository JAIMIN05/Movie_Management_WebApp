const MAX = 5

/**
 * @param {{ value: number; className?: string }} props
 */
export function StarRating({ value, className = '' }) {
  const rating = Math.min(MAX, Math.max(0, Number(value) || 0))
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

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
              i < fullStars
                ? 'text-amber-500 drop-shadow-sm dark:text-amber-400'
                : i === fullStars && hasHalfStar
                ? 'text-amber-500 drop-shadow-sm dark:text-amber-400'
                : 'text-slate-200 dark:text-slate-600'
            }
          >
            {i === fullStars && hasHalfStar ? '⯨' : '★'}
          </span>
        ))}
      </span>
      <span className="text-sm font-medium text-slate-600 tabular-nums dark:text-slate-400">
        {Number(value).toFixed(1)}
      </span>
    </div>
  )
}
