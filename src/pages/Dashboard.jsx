import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineTrendingUp,
  HiOutlinePlusCircle,
  HiOutlineBookOpen,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/miscServices';
import StatCard from '../components/dashboard/StatCard';
import SkeletonCard from '../components/common/SkeletonCard';
import ScoreTrendChart from '../components/dashboard/ScoreTrendChart';
import EmptyState from '../components/common/EmptyState';

export default function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [overviewRes, trendRes] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getScoreTrend('weekly'),
        ]);
        setOverview(overviewRes.data.data);
        setTrend(trendRes.data.data.trend);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your dashboard.');
        toast.error('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s how your interview prep is going.
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/interview" className="btn-primary">
          <HiOutlinePlusCircle className="h-5 w-5" />
          Start Mock Interview
        </Link>
        <Link to="/question-bank" className="btn-secondary">
          <HiOutlineBookOpen className="h-5 w-5" />
          Browse Question Bank
        </Link>
      </div>

      {/* Stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={HiOutlineClipboardList}
          title="Couldn't load your stats"
          description={error}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={HiOutlineClipboardList}
            label="Total Interviews"
            value={overview.totalInterviews}
            accent="brand"
            index={0}
          />
          <StatCard
            icon={HiOutlineCheckCircle}
            label="Completed"
            value={overview.totalCompleted}
            accent="green"
            index={1}
          />
          <StatCard
            icon={HiOutlineTrendingUp}
            label="Average Score"
            value={`${overview.averageScore}%`}
            accent="amber"
            index={2}
          />
          <StatCard
            icon={HiOutlineStar}
            label="Best Score"
            value={`${overview.bestScore}%`}
            accent="rose"
            index={3}
          />
        </div>
      )}

      {/* Chart + Recent interviews */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold">Weekly Performance</h2>
          {isLoading ? (
            <div className="h-64 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ) : trend.length === 0 ? (
            <EmptyState
              icon={HiOutlineTrendingUp}
              title="No performance data yet"
              description="Complete a mock interview to start seeing your progress here."
            />
          ) : (
            <ScoreTrendChart trend={trend} />
          )}
        </div>

        <div className="card">
          <h2 className="mb-4 text-base font-semibold">Recent Interviews</h2>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : overview.recentInterviews.length === 0 ? (
            <EmptyState
              icon={HiOutlineClipboardList}
              title="No interviews yet"
              description="Start your first mock interview to see it here."
            />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {overview.recentInterviews.map((interview) => (
                <li key={interview._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{interview.role}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {interview.company} · {interview.difficulty}
                    </p>
                  </div>
                  <span
                    className={`tag ${
                      interview.status === 'completed'
                        ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300'
                        : 'border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {interview.overallScore != null ? `${interview.overallScore}%` : interview.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
