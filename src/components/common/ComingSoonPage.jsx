export default function ComingSoonPage({ title, description }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="card mt-4 flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description || 'This section is being built next — check back soon.'}
        </p>
      </div>
    </div>
  );
}
