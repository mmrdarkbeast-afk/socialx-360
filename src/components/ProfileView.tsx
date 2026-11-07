import React, { useState } from 'react';
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Edit3,
  CheckCircle2,
  Share2,
  Grid3X3,
  MessageSquare,
  Heart,
  Bookmark,
  Layers,
} from 'lucide-react';
import { UserProfile, Post } from '../types';
import { PostCard } from './PostCard';

interface ProfileViewProps {
  user: UserProfile;
  currentUser: UserProfile;
  posts: Post[];
  onEditProfileClick: () => void;
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onUserClick: (user: UserProfile) => void;
  onBackToFeed: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  posts,
  onEditProfileClick,
  onLikePost,
  onBookmarkPost,
  onRepostPost,
  onAddComment,
  onVotePoll,
  onUserClick,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes' | 'saved'>('posts');
  const [copiedShare, setCopiedShare] = useState(false);
  const isOwnProfile = user.id === currentUser.id;

  // Filter posts for this user
  const authoredPosts = posts.filter(
    (p) => p.author.username.toLowerCase() === user.username.toLowerCase() || p.author.id === user.id
  );
  const mediaPosts = authoredPosts.filter((p) => Boolean(p.imageUrl));
  const likedPosts = posts.filter((p) => p.isLiked);
  const savedPosts = posts.filter((p) => p.isBookmarked);

  const displayedPosts =
    activeTab === 'posts'
      ? authoredPosts
      : activeTab === 'media'
      ? mediaPosts
      : activeTab === 'likes'
      ? likedPosts
      : savedPosts;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="w-full">
      {/* Cover Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={user.coverUrl}
          alt={`${user.displayName}'s cover`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/profile_banner_landscape_1794057468665.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Profile Header Details */}
      <div className="px-4 sm:px-8 pb-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
          {/* Avatar with ring */}
          <div className="relative">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-white dark:ring-slate-900 overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-xl">
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/feed_portrait_art_1794057469353.jpg';
                }}
              />
            </div>
            {user.verified && (
              <div
                title="Verified Creator"
                className="absolute bottom-1 right-1 bg-white dark:bg-slate-900 rounded-full p-0.5"
              >
                <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900" />
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 self-start sm:self-end mt-2 sm:mt-0">
            {isOwnProfile ? (
              <button
                type="button"
                onClick={onEditProfileClick}
                className="px-4 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2 border border-slate-200/80 dark:border-slate-700/80"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
              >
                Follow
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700/80"
              title="Share profile link"
              aria-label="Share profile link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedShare && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in">
                Link copied!
              </span>
            )}
          </div>
        </div>

        {/* Name and Handle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {user.displayName}
            </h1>
          </div>
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
            @{user.username}
          </p>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl whitespace-pre-line">
            {user.bio}
          </p>
        )}

        {/* Clean unboxed metadata with separators (§1.A Zero-Pill discipline) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-xs text-slate-500 dark:text-slate-400">
          {user.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{user.location}</span>
            </div>
          )}
          {user.website && (
            <>
              {user.location && <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>}
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <a
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[200px]"
                >
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </>
          )}
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>Joined {user.joinedDate}</span>
          </div>
        </div>

        {/* Follower & Post Numerical Stats */}
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {authoredPosts.length > 0 ? authoredPosts.length : user.postsCount}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">Posts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {user.followingCount.toLocaleString()}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">Following</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {user.followersCount.toLocaleString()}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">Followers</span>
          </div>
        </div>
      </div>

      {/* Segmented Profile Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'posts'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Posts ({authoredPosts.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 py-3.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'media'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span>Media ({mediaPosts.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('likes')}
          className={`flex items-center gap-2 py-3.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'likes'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Liked ({likedPosts.length})</span>
        </button>
        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-3.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Tab Content Display */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {activeTab === 'media' && mediaPosts.length > 0 ? (
          <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mediaPosts.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                <img
                  src={post.imageUrl}
                  alt={post.imageAlt || 'Media preview'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 fill-white" />
                    {post.comments.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : displayedPosts.length > 0 ? (
          displayedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={() => onLikePost(post.id)}
              onBookmark={() => onBookmarkPost(post.id)}
              onRepost={() => onRepostPost(post.id)}
              onAddComment={(text) => onAddComment(post.id, text)}
              onVotePoll={(optId) => onVotePoll(post.id, optId)}
              onAuthorClick={() => onUserClick(post.author)}
            />
          ))
        ) : (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <p className="text-sm font-medium">No items in this section yet.</p>
            <p className="text-xs">
              {activeTab === 'posts' && 'Published posts will appear here.'}
              {activeTab === 'media' && 'Posts with attached photography or visuals will show up here.'}
              {activeTab === 'likes' && 'Posts you like will be collected in this tab.'}
              {activeTab === 'saved' && 'Bookmarks you save from the feed will be stored here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
