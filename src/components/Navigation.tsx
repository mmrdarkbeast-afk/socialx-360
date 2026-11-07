import React from 'react';
import {
  Home,
  Compass,
  Bell,
  Mail,
  Bookmark,
  User,
  PenSquare,
  Moon,
  Sun,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab = 'home' | 'explore' | 'analytics' | 'notifications' | 'messages' | 'bookmarks' | 'profile';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentUser: UserProfile;
  onOpenCreatePost: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  onOpenCreatePost,
  isDarkMode,
  onToggleDarkMode,
  unreadNotificationsCount,
  unreadMessagesCount,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Feed', icon: Home },
    { id: 'explore' as NavTab, label: 'Explore', icon: Compass },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3 },
    {
      id: 'notifications' as NavTab,
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    {
      id: 'messages' as NavTab,
      label: 'Messages',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { id: 'bookmarks' as NavTab, label: 'Bookmarks', icon: Bookmark },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 h-screen sticky top-0 px-4 py-6 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none transition-colors">
        <div className="space-y-6">
          {/* Brand Wordmark (Constitution §2: Single text element wordmark, no decorative subtitles) */}
          <div className="flex items-center justify-between px-3">
            <button
              type="button"
              onClick={() => onTabChange('home')}
              className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2 text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-bold text-sm shadow-sm">
                V
              </div>
              <span className="font-extrabold">Verve</span>
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-[11px] font-mono tabular-nums font-semibold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Create Post Button */}
          <div className="pt-2 px-1">
            <button
              type="button"
              onClick={onOpenCreatePost}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              <PenSquare className="w-4 h-4 group-hover:rotate-6 transition-transform" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Current User Profile Card in Sidebar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`w-full p-2.5 rounded-xl flex items-center gap-3 transition-colors text-left ${
              currentTab === 'profile'
                ? 'bg-slate-100 dark:bg-slate-800'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/src/assets/images/feed_portrait_art_1794057469353.jpg';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {currentUser.displayName}
              </p>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 truncate">
                @{currentUser.username}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Top App Bar (§3 Pattern 2) */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-bold text-xs">
            V
          </div>
          <span>Verve</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-300 dark:ring-slate-700"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Fixed Tab Bar (§3 Pattern 1) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[48px] min-h-[48px] py-1 text-xs transition-colors ${
                isActive
                  ? 'text-slate-900 dark:text-slate-100 font-semibold'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              {item.badge !== undefined && (
                <span className="absolute top-1 right-2.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
        {/* Mobile floating post trigger */}
        <button
          type="button"
          onClick={onOpenCreatePost}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-indigo-600 dark:text-indigo-400 font-semibold"
          title="Create post"
        >
          <PenSquare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Post</span>
        </button>
      </nav>
    </>
  );
};
