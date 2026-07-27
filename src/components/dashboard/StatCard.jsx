import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, accent = 'brand', index = 0 }) {
  const accentClasses = {
    brand: 'border-brand-300 text-brand-700 dark:border-brand-700 dark:text-brand-300',
    green: 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300',
    amber: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300',
    rose: 'border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease: 'easeOut' }}
      className="card flex items-center gap-4"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 ${accentClasses[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="font-mono text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}
