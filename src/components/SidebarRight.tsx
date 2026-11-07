import React from 'react';
import { Search, CheckCircle2, TrendingUp, Sparkles, UserPlus, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarRightProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  suggestedUsers: UserProfile[];
  followingUserIds: Set<string>;
  onToggleFollow: (userId: string) => void;
  onUserClick: (user: UserProfile) => void;
  onOpenDashboard?: () => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  searchQuery,
  onSearchChange,
  selectedTopic,
  onSelectTopic,
  suggestedUsers,
  followingUserIds,
  onToggleFollow,
  onUserClick,
  onOpenDashboard,
}) => {
  const trendingTopics = [
    { tag: 'Architecture', count: '14.2k posts', description: 'Monolithic concrete & timber pavilions' },
    { tag: 'Design Systems', count: '8.9k posts', description: 'Spatial layout tokens & typography' },
    { tag: 'Photography', count: '23.1k posts', description: 'Nordic landscapes & blue-hour mist' },
    { tag: 'Industrial Design', count: '6.4k posts', description: 'Machined finishes & tactile hardware' },
    { tag: 'Visual Arts', count: '11.5k posts', description: 'Editorial portraits & light studies' },
  ];

  return (
    <aside className="hidden xl:block w-80 2xl:w-88 h-screen sticky top-0 px-4 py-6 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto select-none transition-colors">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search posts, creators, tags..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Trending Topics (Segmented interactive buttons, not pill badge sandwiches) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Disciplines</span>
            </h3>
            <div className="flex items-center gap-2">
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  Analytics
                </button>
              )}
              {selectedTopic && (
                <button
                  type="button"
                  onClick={() => onSelectTopic(null)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 -mx-1">
            {trendingTopics.map((item) => {
              const isSelected = selectedTopic === item.tag;
              return (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => onSelectTopic(isSelected ? null : item.tag)}
                  className={`w-full text-left p-2 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'hover:bg-white/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      #{item.tag}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400">
                      {item.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Creators */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creators to Follow</span>
            </h3>
          </div>

          <div className="space-y-3">
            {suggestedUsers.map((creator) => {
              const isFollowing = followingUserIds.has(creator.id);
              return (
                <div key={creator.id} className="flex items-start justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={() => onUserClick(creator)}
                    className="flex items-start gap-2.5 text-left min-w-0 flex-1 group"
                  >
                    <img
                      src={creator.avatarUrl}
                      alt={creator.displayName}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 group-hover:opacity-90 transition-opacity"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:underline">
                          {creator.displayName}
                        </span>
                        {creator.verified && (
                          <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0 fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900" />
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
                        @{creator.username}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {creator.bio}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleFollow(creator.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      isFollowing
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                        : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiet Footer Links */}
        <div className="px-2 text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span>Terms</span>
            <span>·</span>
            <span>Privacy</span>
            <span>·</span>
            <span>Guidelines</span>
            <span>·</span>
            <span>API</span>
          </div>
          <p>© 2026 Verve Commons. Pure human craft.</p>
        </div>
      </div>
    </aside>
  );
};
