import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlineClock, HiOutlineChevronRight } from 'react-icons/hi';
import { interviewService } from '../services/interviewService';
import EmptyState from '../components/common/EmptyState';
import { scoreTextColor, formatDate } from '../utils/formatters';

const STATUS_STYLES = {
  completed: 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300',
  in_progress: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300',
  abandoned: 'border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300',
};

export default function History() {
  const [interviews, setInterviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const { data } = await interviewService.getHistory(params);
      setInterviews(data.data.items);
      setPagination(data.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load interview history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = {
      page: 1,
      limit: 10,
      ...(search && { search }),
      ...(status && { status }),
    };
    const timeout = setTimeout(() => fetchHistory(params), 300);
    return () => clearTimeout(timeout);
  }, [search, status, fetchHistory]);

  const handlePageChange = (page) => {
    fetchHistory({ page, limit: 10, ...(search && { search }), ...(status && { status }) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Interview History</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review past mock interviews and track your progress.
        </p>
      </div>

      <div className="card flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field sm:w-48">
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In progress</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl2 bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={HiOutlineClock}
          title="No interviews yet"
          description="Your completed and in-progress mock interviews will show up here."
          action={
            <Link to="/interview" className="btn-primary">
              Start Your First Interview
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <Link
              key={interview._id}
              to={`/history/${interview._id}`}
              className="card flex items-center justify-between gap-4 transition hover:shadow-card-hover"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold">{interview.role}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {interview.company} · <span className="capitalize">{interview.difficulty}</span> ·{' '}
                    {formatDate(interview.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`tag ${STATUS_STYLES[interview.status]}`}>
                  {interview.status.replace('_', ' ')}
                </span>
                {interview.overallScore != null && (
                  <span className={`text-lg font-bold ${scoreTextColor(interview.overallScore)}`}>
                    {interview.overallScore}%
                  </span>
                )}
                <HiOutlineChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                pagination.page === i + 1
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
