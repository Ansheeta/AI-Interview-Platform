import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
  HiOutlineClipboardList,
} from 'react-icons/hi';
import { scoreTextColor } from '../../utils/formatters';

function stampTone(score) {
  if (score >= 80) return 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400';
  if (score >= 60) return 'border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400';
  return 'border-rose-600 text-rose-600 dark:border-rose-400 dark:text-rose-400';
}

/**
 * The app's signature moment: your evaluated score renders as a rubber
 * stamp being pressed onto the page — a double ring, tilted a few
 * degrees, in place of the circular progress-ring every AI dashboard uses.
 */
function ScoreStamp({ score }) {
  const tone = stampTone(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
      className={`flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4 border-double ${tone}`}
    >
      <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border ${tone}`}>
        <span className="font-mono text-4xl font-bold leading-none">{score}</span>
        <span className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-widest">
          Scored
        </span>
      </div>
    </motion.div>
  );
}

export default function InterviewResults({ interview }) {
  const { questions, answers, overallScore, overallFeedback, strengths, improvements } = interview;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <ScoreStamp score={overallScore} />
        <div>
          <h2 className="text-lg font-bold">Your Interview Results</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{overallFeedback}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <HiOutlineCheckCircle className="h-5 w-5" />
            Strengths
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {strengths?.length ? (
              strengths.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-500">•</span> {s}
                </li>
              ))
            ) : (
              <li className="text-slate-400">No specific strengths highlighted.</li>
            )}
          </ul>
        </div>

        <div className="card">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
            <HiOutlineExclamationCircle className="h-5 w-5" />
            Suggestions for Improvement
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {improvements?.length ? (
              improvements.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-500">•</span> {s}
                </li>
              ))
            ) : (
              <li className="text-slate-400">No specific suggestions provided.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 text-sm font-semibold">Question-by-Question Breakdown</h3>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const answer = answers.find((a) => a.questionIndex === i);
            return (
              <div key={i} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <span className="tag border-brand-200 text-brand-700 dark:border-brand-700 dark:text-brand-300">
                      {q.category}
                    </span>
                    <p className="mt-2 text-sm font-medium">{q.questionText}</p>
                  </div>
                  {answer?.score != null && (
                    <span className={`shrink-0 font-mono text-lg font-bold ${scoreTextColor(answer.score)}`}>
                      {answer.score}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Your answer: </span>
                  {answer?.answerText || <em>No answer provided</em>}
                </p>
                {answer?.feedback && (
                  <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                    {answer.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/interview" className="btn-primary">
          <HiOutlineRefresh className="h-5 w-5" />
          Start Another Interview
        </Link>
        <Link to="/history" className="btn-secondary">
          <HiOutlineClipboardList className="h-5 w-5" />
          View Full History
        </Link>
      </div>
    </div>
  );
}
