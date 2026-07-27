import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineCamera, HiOutlinePencil } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function Profile() {
  const { user, updateUserInPlace } = useAuth();
  const fileInputRef = useRef(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await authService.uploadAvatar(formData);
      updateUserInPlace({ avatar: data.data.user.avatar });
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const { data } = await authService.updateProfile(profileForm);
      updateUserInPlace({ name: data.data.user.name });
      toast.success('Profile updated!');
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    try {
      await authService.changePassword(passwordForm);
      toast.success('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Avatar + basic info */}
      <div className="card flex items-center gap-5">
        <div className="group relative">
          <img
            src={
              user?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${user.avatar}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=9C6F2E&color=fff&size=128`
            }
            alt="avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
          <button
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition group-hover:opacity-100"
            aria-label="Change avatar"
          >
            <HiOutlineCamera className="h-6 w-6" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="text-lg font-semibold">{user?.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>
      </div>

      {/* Edit profile */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Personal Information</h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              <HiOutlinePencil className="h-4 w-4" /> Edit
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Full Name</label>
              <input
                type="text"
                required
                minLength={2}
                value={profileForm.name}
                onChange={(e) => setProfileForm({ name: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isSavingProfile} className="btn-primary">
                {isSavingProfile ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <p>
              <span className="font-medium">Name:</span> {user?.name}
            </p>
            <p className="mt-1">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="card">
        <h2 className="mb-4 text-base font-semibold">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={isChangingPassword} className="btn-primary">
            {isChangingPassword ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
