import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineClock } from 'react-icons/hi';
import { interviewService } from '../services/interviewService';
import InterviewResults from '../components/interview/InterviewResults';
import EmptyState from '../components/common/EmptyState';

export default function InterviewDetail() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await interviewService.getById(id);
        setInterview(data.data.interview);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load this interview.';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="space-y-6">
      <Link
        to="/history"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to History
      </Link>

      {isLoading ? (
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-40 animate-pulse rounded-xl2 bg-slate-100 dark:bg-slate-800" />
          <div className="h-64 animate-pulse rounded-xl2 bg-slate-100 dark:bg-slate-800" />
        </div>
      ) : error ? (
        <EmptyState icon={HiOutlineClock} title="Couldn't load interview" description={error} />
      ) : interview.status === 'completed' ? (
        <InterviewResults interview={interview} />
      ) : (
        <div className="mx-auto max-w-2xl">
          <EmptyState
            icon={HiOutlineClock}
            title={`This interview is ${interview.status.replace('_', ' ')}`}
            description={
              interview.status === 'in_progress'
                ? 'This interview was never submitted for AI evaluation, so there are no results yet.'
                : 'This interview was abandoned before completion.'
            }
            action={
              <Link to="/interview" className="btn-primary">
                Start a New Interview
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
