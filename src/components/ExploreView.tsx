import React from 'react';
import { Compass, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Post, UserProfile } from '../types';

interface ExploreViewProps {
  posts: Post[];
  suggestedUsers: UserProfile[];
  followingUserIds: Set<string>;
  onToggleFollow: (userId: string) => void;
  onPostClick: (post: Post) => void;
  onUserClick: (user: UserProfile) => void;
  onSelectTopic: (topic: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  suggestedUsers,
  followingUserIds,
  onToggleFollow,
  onPostClick,
  onUserClick,
  onSelectTopic,
}) => {
  const mediaPosts = posts.filter((p) => Boolean(p.imageUrl));

  const categories = [
    { title: 'Architecture', count: '14.2k items', image: '/src/assets/images/feed_creator_architecture_1794057466613.jpg' },
    { title: 'Photography', count: '23.1k items', image: '/src/assets/images/feed_travel_cinematic_1794057467320.jpg' },
    { title: 'Industrial Design', count: '6.4k items', image: '/src/assets/images/feed_product_workspace_1794057467846.jpg' },
    { title: 'Visual Arts', count: '11.5k items', image: '/src/assets/images/profile_banner_landscape_1794057468665.jpg' },
  ];

  return (
    <div className="w-full p-4 sm:p-6 space-y-8 bg-white dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5" />
          <span>Explore Disciplines</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Discover visual monographs, technical dispatches, and leading creators
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.title}
            type="button"
            onClick={() => onSelectTopic(cat.title)}
            className="group relative h-28 sm:h-36 rounded-2xl overflow-hidden text-left border border-slate-200 dark:border-slate-800 transition-transform active:scale-95"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end text-white">
              <span className="text-xs sm:text-sm font-bold">{cat.title}</span>
              <span className="text-[10px] text-white/70 font-mono">{cat.count}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Visual Showcase Bento Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Featured Visual Work</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mediaPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onPostClick(post)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 cursor-pointer shadow-sm"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.imageAlt || 'Showcase'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.displayName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {post.author.displayName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    @{post.author.username}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {post.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Creators Spotlight */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Spotlight Creators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedUsers.map((user) => {
            const isFollowing = followingUserIds.has(user.id);
            return (
              <div
                key={user.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => onUserClick(user)}
                  className="flex items-start gap-3 text-left min-w-0 flex-1 group"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:underline">
                        {user.displayName}
                      </span>
                      {user.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900" />
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block truncate">
                      @{user.username}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                      {user.bio}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFollow(user.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isFollowing
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
