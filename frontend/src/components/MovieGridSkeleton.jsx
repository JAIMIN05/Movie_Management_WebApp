function SkeletonTile() {
  return (
    <div
      className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900"
      aria-hidden
    >
      <div className="space-y-3 pr-20">
        <div className="h-5 w-4/5 max-w-[14rem] animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-24 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 w-16 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="mt-6 flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="h-5 w-5 animate-pulse rounded-sm bg-slate-200 dark:bg-slate-700"
          />
        ))}
        <div className="ml-2 h-5 w-10 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  )
}

/**
 * @param {{ count?: number }} props
 */
export function MovieGridSkeleton({ count = 9 }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading movies"
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonTile key={i} />
      ))}
    </div>
  )
}
