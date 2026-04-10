export function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 shadow-sm shadow-slate-900/5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-black/20">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-base font-bold text-white shadow-md shadow-indigo-600/30"
            aria-hidden
          >
            M
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-white">
              Movie Library
            </h1>
            <p className="truncate text-xs text-slate-600 sm:text-sm dark:text-slate-400">
              Browse, add, and manage your collection
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="mt-auto border-t border-slate-200/80 bg-white/80 py-5 text-center text-xs text-slate-500 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-500 sm:text-sm">
        Movie Library · React · Gin · MongoDB
      </footer>
    </div>
  )
}
