import React, { useState } from 'react';
import { Heart, MessageCircle, UserPlus, Repeat2, Check, Bell } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onNotificationClick: (item: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onMarkAllRead,
  onNotificationClick,
}) => {
  const [filter, setFilter] = useState<'all' | 'mentions' | 'likes'>('all');

  const filtered = notifications.filter((item) => {
    if (filter === 'likes') return item.type === 'like';
    if (filter === 'mentions') return item.type === 'comment';
    return true;
  });

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Activity & Notifications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time interactions from the Verve community
          </p>
        </div>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All Activity
        </button>
        <button
          type="button"
          onClick={() => setFilter('mentions')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'mentions'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Comments
        </button>
        <button
          type="button"
          onClick={() => setFilter('likes')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'likes'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Likes
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onNotificationClick(item)}
              className={`p-4 sm:px-6 flex items-start gap-3.5 cursor-pointer transition-colors ${
                !item.read
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {/* Type Icon Badge */}
              <div className="mt-1 shrink-0">
                {item.type === 'like' && (
                  <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                )}
                {item.type === 'comment' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </div>
                )}
                {item.type === 'follow' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <UserPlus className="w-4 h-4" />
                  </div>
                )}
                {item.type === 'repost' && (
                  <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Repeat2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <img
                    src={item.user.avatarUrl}
                    alt={item.user.displayName}
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.user.displayName}
                    </span>{' '}
                    {item.type === 'like' && 'liked your post'}
                    {item.type === 'comment' && 'replied to your post'}
                    {item.type === 'follow' && 'started following your studio'}
                    {item.type === 'repost' && 'reposted your work'}
                  </p>
                </div>
                {item.postSnippet && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                    "{item.postSnippet}"
                  </p>
                )}
                <span className="mt-1 block text-[11px] text-slate-400">
                  {item.createdAt}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto stroke-1" />
            <p className="text-sm font-semibold">No notifications</p>
            <p className="text-xs">You are all caught up with your interactions.</p>
          </div>
        )}
      </div>
    </div>
  );
};
