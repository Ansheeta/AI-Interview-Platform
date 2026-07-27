import { HiOutlineBookmark } from 'react-icons/hi';
import { HiBookmark } from 'react-icons/hi2';

const DIFFICULTY_STYLES = {
  easy: 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300',
  medium: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300',
  hard: 'border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-300',
};

export default function QuestionCard({ question, onToggleBookmark }) {
  return (
    <div className="card flex items-start justify-between gap-4">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="tag border-brand-300 text-brand-700 dark:border-brand-700 dark:text-brand-300">
            {question.category}
          </span>
          <span className={`tag ${DIFFICULTY_STYLES[question.difficulty]}`}>
            {question.difficulty}
          </span>
          {question.company && (
            <span className="tag border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300">
              {question.company}
            </span>
          )}
        </div>
        <p className="text-sm font-medium leading-relaxed">{question.questionText}</p>
      </div>

      <button
        onClick={() => onToggleBookmark(question._id)}
        className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
        aria-label={question.isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
      >
        {question.isBookmarked ? (
          <HiBookmark className="h-5 w-5 text-brand-600" />
        ) : (
          <HiOutlineBookmark className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
