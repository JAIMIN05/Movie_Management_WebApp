import { Toaster } from 'react-hot-toast'

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      containerClassName="!top-4 sm:!top-6"
      toastOptions={{
        duration: 4000,
        className:
          '!rounded-xl !px-4 !py-3 !text-sm !font-medium !shadow-lg !border !border-slate-200/80 dark:!border-slate-600/80',
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-color)',
          maxWidth: 'min(100vw - 2rem, 24rem)',
        },
        success: {
          iconTheme: {
            primary: '#4f46e5',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#dc2626',
            secondary: '#ffffff',
          },
        },
      }}
    />
  )
}
