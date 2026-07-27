export default function FullPageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-surface-dark">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading your workspace…</p>
      </div>
    </div>
  );
}
