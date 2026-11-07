import React, { useState, useRef } from 'react';
import { X, Camera, Image as ImageIcon, Link as LinkIcon, MapPin, Check, Upload } from 'lucide-react';
import { UserProfile } from '../types';
import { PROFILE_PHOTO_PRESETS, COVER_PHOTO_PRESETS } from '../data/mockData';

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username.replace(/^@/, ''));
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [coverUrl, setCoverUrl] = useState(user.coverUrl);
  const [location, setLocation] = useState(user.location || '');
  const [website, setWebsite] = useState(user.website || '');
  const [activePresetTab, setActivePresetTab] = useState<'avatar' | 'cover' | null>(null);

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      displayName: displayName.trim() || user.displayName,
      username: username.trim().replace(/^@/, '') || user.username,
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || user.avatarUrl,
      coverUrl: coverUrl.trim() || user.coverUrl,
      location: location.trim(),
      website: website.trim(),
    });
    onClose();
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close edit profile modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 id="edit-profile-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Edit Profile
            </h2>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
          >
            Save changes
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Visual Previews and Cover / Avatar controls */}
          <div className="relative">
            {/* Cover photo preview */}
            <div className="relative h-36 sm:h-44 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60 group">
              <img
                src={coverUrl}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/profile_banner_landscape_1794057468665.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center gap-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs font-medium backdrop-blur-sm flex items-center gap-1.5 transition-colors"
                  title="Upload cover photo"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePresetTab(activePresetTab === 'cover' ? null : 'cover')}
                  className="px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs font-medium backdrop-blur-sm flex items-center gap-1.5 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Presets</span>
                </button>
              </div>
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverFileUpload}
              />
            </div>

            {/* Avatar preview */}
            <div className="absolute -bottom-10 left-5">
              <div className="relative w-20 h-20 rounded-full ring-4 ring-white dark:ring-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md group">
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/feed_portrait_art_1794057469353.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="p-1.5 text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors"
                    title="Upload profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileUpload}
                />
              </div>
            </div>
          </div>

          {/* Quick preset pickers if opened */}
          {activePresetTab === 'cover' && (
            <div className="pt-8 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Choose Cover Photo</span>
                <button
                  type="button"
                  onClick={() => setActivePresetTab(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COVER_PHOTO_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setCoverUrl(preset.url)}
                    className={`relative rounded-lg overflow-hidden h-16 border-2 transition-all ${
                      coverUrl === preset.url
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                        : 'border-transparent hover:opacity-90'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[10px] text-white px-1.5 py-0.5 truncate text-left">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 space-y-4">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                maxLength={50}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name or moniker"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username / Handle
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-mono">
                  @
                </span>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9._]/g, ''))}
                  placeholder="handle"
                  className="w-full pl-8 pr-3.5 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Biography
                </label>
                <span className="text-xs text-slate-400 tabular-nums">
                  {bio.length}/160
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={160}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short biography introducing your craft, perspective, or interests..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all resize-none"
              />
            </div>

            {/* Profile Picture URL & Presets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Profile Picture URL
                </label>
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Choose file instead
                </button>
              </div>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all truncate"
              />
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                <span className="text-[11px] text-slate-400 shrink-0">Presets:</span>
                {PROFILE_PHOTO_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`shrink-0 w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                      avatarUrl === preset.url
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Photo URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Cover Photo URL
                </label>
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Choose file instead
                </button>
              </div>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all truncate"
              />
            </div>

            {/* Location & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={40}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Stockholm & SF"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website / Portfolio
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="alexrivers.design"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
