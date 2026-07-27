import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlineBookOpen } from 'react-icons/hi';
import { questionBankService } from '../services/miscServices';
import QuestionCard from '../components/questionBank/QuestionCard';
import EmptyState from '../components/common/EmptyState';

const CATEGORIES = [
  'Data Structures & Algorithms',
  'System Design',
  'Behavioral',
  'Database',
  'Operating Systems',
  'Networking',
  'Frontend',
  'Backend',
  'OOP & Design Patterns',
  'General',
];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ category: '', difficulty: '', search: '' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const { data } = await questionBankService.list(params);
      setQuestions(data.data.items);
      setPagination(data.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load questions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = {
      page: 1,
      limit: 12,
      ...(filters.category && { category: filters.category }),
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.search && { search: filters.search }),
    };
    const timeout = setTimeout(() => fetchQuestions(params), 300);
    return () => clearTimeout(timeout);
  }, [filters, fetchQuestions]);

  const handleToggleBookmark = async (questionId) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q))
    );
    try {
      await questionBankService.toggleBookmark(questionId);
    } catch {
      toast.error('Failed to update bookmark.');
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q))
      );
    }
  };

  const handlePageChange = (page) => {
    fetchQuestions({
      page,
      limit: 12,
      ...(filters.category && { category: filters.category }),
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.search && { search: filters.search }),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Question Bank</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Browse and bookmark curated interview questions.
        </p>
      </div>

      <div className="card flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions…"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="input-field pl-10"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          className="input-field sm:w-56"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
          className="input-field sm:w-40"
        >
          <option value="">All difficulties</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d} className="capitalize">
              {d}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl2 bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <EmptyState
          icon={HiOutlineBookOpen}
          title="No questions found"
          description="Try adjusting your filters or search term."
        />
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard key={q._id} question={q} onToggleBookmark={handleToggleBookmark} />
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
