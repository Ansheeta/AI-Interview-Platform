import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineChartBar, HiOutlineTrendingUp } from 'react-icons/hi';
import { analyticsService } from '../services/miscServices';
import ScoreTrendChart from '../components/dashboard/ScoreTrendChart';
import TopicWiseChart from '../components/analytics/TopicWiseChart';
import EmptyState from '../components/common/EmptyState';

export default function Analytics() {
  const [granularity, setGranularity] = useState('weekly');
  const [trend, setTrend] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [isLoadingTrend, setIsLoadingTrend] = useState(true);
  const [isLoadingBreakdown, setIsLoadingBreakdown] = useState(true);

  const fetchTrend = useCallback(async (g) => {
    setIsLoadingTrend(true);
    try {
      const { data } = await analyticsService.getScoreTrend(g);
      setTrend(data.data.trend);
    } catch {
      toast.error('Failed to load score trend.');
    } finally {
      setIsLoadingTrend(false);
    }
  }, []);

  useEffect(() => {
    fetchTrend(granularity);
  }, [granularity, fetchTrend]);

  useEffect(() => {
    const fetchBreakdown = async () => {
      setIsLoadingBreakdown(true);
      try {
        const { data } = await analyticsService.getTopicWise();
        setBreakdown(data.data.breakdown);
      } catch {
        toast.error('Failed to load topic-wise analysis.');
      } finally {
        setIsLoadingBreakdown(false);
      }
    };
    fetchBreakdown();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track your performance trends and topic strengths over time.
        </p>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Score Trend</h2>
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {['weekly', 'monthly'].map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
                  granularity === g
                    ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-700 dark:text-brand-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {isLoadingTrend ? (
          <div className="h-64 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        ) : trend.length === 0 ? (
          <EmptyState
            icon={HiOutlineTrendingUp}
            title="Not enough data yet"
            description="Complete a few mock interviews to see your score trend."
          />
        ) : (
          <ScoreTrendChart trend={trend} />
        )}
      </div>

      <div className="card">
        <h2 className="mb-4 text-base font-semibold">Topic-Wise Performance</h2>
        {isLoadingBreakdown ? (
          <div className="h-48 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        ) : breakdown.length === 0 ? (
          <EmptyState
            icon={HiOutlineChartBar}
            title="No topic data yet"
            description="Answer questions across different categories to see your breakdown here."
          />
        ) : (
          <TopicWiseChart breakdown={breakdown} />
        )}
      </div>
    </div>
  );
}
