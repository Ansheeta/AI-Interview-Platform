import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineSun, HiOutlineMoon, HiOutlineDesktopComputer, HiOutlineTrash } from 'react-icons/hi';
import { settingsService } from '../services/miscServices';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: HiOutlineSun },
  { value: 'dark', label: 'Dark', icon: HiOutlineMoon },
  { value: 'system', label: 'System', icon: HiOutlineDesktopComputer },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteForm, setDeleteForm] = useState({ password: '', confirm: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await settingsService.get();
        setSettings(data.data.settings);
      } catch {
        toast.error('Failed to load settings.');
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleToggleChange = async (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsSaving(true);
    try {
      await settingsService.update({ [key]: value });
    } catch {
      toast.error('Failed to save setting.');
      setSettings((prev) => ({ ...prev, [key]: !value }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await settingsService.deleteAccount(deleteForm);
      toast.success('Account deleted.');
      await logout();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl2 bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Theme */}
      <div className="card">
        <h2 className="mb-4 text-base font-semibold">Appearance</h2>
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 transition ${
                theme === value
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-500/10'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="card space-y-4">
        <h2 className="text-base font-semibold">Notifications</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Email Notifications</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interview reminders and weekly progress summaries.
            </p>
          </div>
          <Toggle
            checked={settings.emailNotifications}
            onChange={(v) => handleToggleChange('emailNotifications', v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Push Notifications</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time alerts on this device.
            </p>
          </div>
          <Toggle
            checked={settings.pushNotifications}
            onChange={(v) => handleToggleChange('pushNotifications', v)}
          />
        </div>
      </div>

      {/* Privacy */}
      <div className="card space-y-4">
        <h2 className="text-base font-semibold">Privacy</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Profile Visibility</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control whether your profile is visible to others.
            </p>
          </div>
          <select
            value={settings.profileVisibility}
            onChange={(e) => handleToggleChange('profileVisibility', e.target.value)}
            className="input-field w-32"
            disabled={isSaving}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card border-rose-200 dark:border-rose-900/50">
        <h2 className="mb-1 text-base font-semibold text-rose-600 dark:text-rose-400">Danger Zone</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Deleting your account is permanent and cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-500/10"
          >
            <HiOutlineTrash className="h-4 w-4" />
            Delete Account
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                required
                value={deleteForm.password}
                onChange={(e) => setDeleteForm((f) => ({ ...f, password: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </label>
              <input
                type="text"
                required
                value={deleteForm.confirm}
                onChange={(e) => setDeleteForm((f) => ({ ...f, confirm: e.target.value }))}
                className="input-field"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isDeleting}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {isDeleting ? 'Deleting…' : 'Permanently Delete Account'}
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
