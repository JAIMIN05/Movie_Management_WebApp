/** Indeterminate progress strip shown while list refetches */
export function RefreshBar() {
  return (
    <div
      className="refresh-bar relative h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
      role="progressbar"
      aria-valuetext="Updating"
      aria-hidden
    >
      <div className="refresh-bar__indeterminate absolute top-0 h-full w-2/5 rounded-full bg-indigo-500" />
    </div>
  )
}
