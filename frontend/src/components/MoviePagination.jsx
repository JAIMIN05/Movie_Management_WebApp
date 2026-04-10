/**
 * @param {{
 *   page: number
 *   totalPages: number
 *   totalItems: number
 *   pageSize: number
 *   onPageChange: (page: number) => void
 *   disabled?: boolean
 * }} props
 */
export function MoviePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  disabled = false,
}) {
  const visible = getVisiblePageNumbers(page, totalPages)

  const btnBase =
    'min-h-[40px] rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40'
  const btnIdle =
    'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
  const btnActive =
    'border-indigo-600 bg-indigo-600 text-white shadow-sm dark:border-indigo-500 dark:bg-indigo-600'

  if (totalPages <= 1 && totalItems === 0) {
    return null
  }

  return (
    <nav
      className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/80 px-4 py-4 ring-1 ring-slate-900/5 dark:border-slate-700/90 dark:bg-slate-900/50 dark:ring-white/5 sm:flex-row sm:items-center sm:justify-between sm:px-5"
      aria-label="Pagination"
    >
      <p className="text-center text-sm text-slate-600 sm:text-left dark:text-slate-400">
        {totalItems === 0 ? (
          <>No results</>
        ) : (
          <>
            Showing{' '}
            <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {(page - 1) * pageSize + 1}
            </span>
            –
            <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {Math.min(page * pageSize, totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {totalItems}
            </span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`${btnBase} ${btnIdle} px-4`}
        >
          Previous
        </button>

        <ul className="flex max-w-full flex-wrap items-center justify-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {visible.map((item, i) =>
            item === '…' ? (
              <li
                key={`e-${i}`}
                className="px-1.5 text-slate-400"
                aria-hidden
              >
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onPageChange(item)}
                  className={`${btnBase} min-w-9 ${
                    item === page ? btnActive : btnIdle
                  }`}
                  aria-current={item === page ? 'page' : undefined}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ul>

        <button
          type="button"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`${btnBase} ${btnIdle} px-4`}
        >
          Next
        </button>
      </div>
    </nav>
  )
}

/**
 * @param {number} current
 * @param {number} total
 * @returns {(number | '…')[]}
 */
function getVisiblePageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  /** @type {(number | '…')[]} */
  const out = []
  out.push(1)

  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)

  if (start > 2) out.push('…')
  for (let p = start; p <= end; p += 1) out.push(p)
  if (end < total - 1) out.push('…')

  if (total > 1) out.push(total)
  return out
}
