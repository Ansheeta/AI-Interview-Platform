import { useState } from 'react';
import { HiOutlineOfficeBuilding, HiOutlineBriefcase, HiOutlineLightningBolt } from 'react-icons/hi';

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', description: 'Entry-level, fundamentals' },
  { value: 'medium', label: 'Medium', description: 'Mid-level, applied concepts' },
  { value: 'hard', label: 'Hard', description: 'Senior-level, deep dives' },
];

const POPULAR_COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Infosys', 'TCS'];
const POPULAR_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
];

export default function InterviewSetup({ onStart, isStarting }) {
  const [form, setForm] = useState({
    company: '',
    role: '',
    difficulty: 'medium',
    numberOfQuestions: 5,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onStart({ ...form, numberOfQuestions: Number(form.numberOfQuestions) });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="card space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <HiOutlineOfficeBuilding className="h-4 w-4 text-brand-600" />
          Target Company
        </label>
        <input
          type="text"
          name="company"
          required
          value={form.company}
          onChange={handleChange}
          placeholder="e.g. Google, Amazon, or your dream company"
          className="input-field"
          list="popular-companies"
        />
        <datalist id="popular-companies">
          {POPULAR_COMPANIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div className="card space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <HiOutlineBriefcase className="h-4 w-4 text-brand-600" />
          Target Role
        </label>
        <input
          type="text"
          name="role"
          required
          value={form.role}
          onChange={handleChange}
          placeholder="e.g. Software Engineer, Frontend Developer"
          className="input-field"
          list="popular-roles"
        />
        <datalist id="popular-roles">
          {POPULAR_ROLES.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </div>

      <div className="card space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <HiOutlineLightningBolt className="h-4 w-4 text-brand-600" />
          Difficulty
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DIFFICULTIES.map((d) => (
            <button
              type="button"
              key={d.value}
              onClick={() => setForm((prev) => ({ ...prev, difficulty: d.value }))}
              className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                form.difficulty === d.value
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-500/10'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
              }`}
            >
              <p className="text-sm font-semibold">{d.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{d.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-2">
        <label className="text-sm font-medium">Number of Questions</label>
        <input
          type="range"
          name="numberOfQuestions"
          min={3}
          max={10}
          value={form.numberOfQuestions}
          onChange={handleChange}
          className="w-full accent-brand-600"
        />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {form.numberOfQuestions} questions
        </p>
      </div>

      <button type="submit" disabled={isStarting} className="btn-primary w-full">
        {isStarting ? 'Generating your interview…' : 'Start Mock Interview'}
      </button>
    </form>
  );
}
