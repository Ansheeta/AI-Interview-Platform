import { useState } from 'react';
import { HiOutlineMenu, HiOutlineLogout, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
      <button
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <HiOutlineMenu className="h-6 w-6" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {isDark ? <HiOutlineSun className="h-5 w-5" /> : <HiOutlineMoon className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=9C6F2E&color=fff`}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-100 bg-white py-1 shadow-card dark:border-slate-800 dark:bg-slate-900"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <HiOutlineLogout className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
