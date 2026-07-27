import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineChatAlt2,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineCog,
} from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { to: '/interview', label: 'Mock Interview', icon: HiOutlineChatAlt2 },
  { to: '/question-bank', label: 'Question Bank', icon: HiOutlineBookOpen },
  { to: '/history', label: 'History', icon: HiOutlineClock },
  { to: '/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { to: '/profile', label: 'Profile', icon: HiOutlineUser },
  { to: '/settings', label: 'Settings', icon: HiOutlineCog },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand mark: a wax-seal-style stamped disc rather than a
            gradient-square app icon. */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-600 font-mono text-[10px] font-bold text-brand-600 dark:border-brand-400 dark:text-brand-400">
            AI
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            The Prep Binder
          </span>
        </div>

        {/* Nav items styled as divider tabs on a binder spine: a colored
            flag sits flush against the left edge and only "connects" to
            the content when active, rather than a floating rounded pill. */}
        <nav className="mt-3 flex flex-col px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 border-l-[3px] px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
