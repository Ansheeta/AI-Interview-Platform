import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-surface-dark">
      <p className="text-6xl font-black text-brand-600">404</p>
      <h1 className="mt-2 text-xl font-bold">Page not found</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/dashboard" className="btn-primary mt-6">
        Back to Dashboard
      </Link>
    </div>
  );
}
