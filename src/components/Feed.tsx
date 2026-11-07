import React, { useState } from 'react';
import { Post, UserProfile, Story } from '../types';
import { StoriesBar } from './StoriesBar';
import { PostCard } from './PostCard';
import { Image as ImageIcon, BarChart2, PenSquare, X } from 'lucide-react';

interface FeedProps {
  posts: Post[];
  currentUser: UserProfile;
  stories: Story[];
  selectedTopic: string | null;
  onClearTopic: () => void;
  searchQuery: string;
  onClearSearch: () => void;
  onStoryClick: (index: number) => void;
  onAddStoryClick: () => void;
  onOpenCreatePost: () => void;
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onUserClick: (user: UserProfile) => void;
}

export const Feed: React.FC<FeedProps> = ({
  posts,
  currentUser,
  stories,
  selectedTopic,
  onClearTopic,
  searchQuery,
  onClearSearch,
  onStoryClick,
  onAddStoryClick,
  onOpenCreatePost,
  onLikePost,
  onBookmarkPost,
  onRepostPost,
  onAddComment,
  onVotePoll,
  onUserClick,
}) => {
  const [feedFilter, setFeedFilter] = useState<'for_you' | 'following' | 'media' | 'discussions'>('for_you');

  // Filter posts based on selected tab, search query, and topic
  const filteredPosts = posts.filter((post) => {
    // Topic tag filter
    if (selectedTopic && post.topicTag?.toLowerCase() !== selectedTopic.toLowerCase()) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor =
        post.author.displayName.toLowerCase().includes(q) ||
        post.author.username.toLowerCase().includes(q);
      const matchTopic = post.topicTag?.toLowerCase().includes(q);
      if (!matchContent && !matchAuthor && !matchTopic) {
        return false;
      }
    }

    // Segmented tab filter
    if (feedFilter === 'media' && !post.imageUrl) return false;
    if (feedFilter === 'discussions' && !post.poll && post.comments.length === 0) return false;
    if (feedFilter === 'following' && post.author.id === currentUser.id) return false;

    return true;
  });

  return (
    <div className="w-full">
      {/* Stories Bar */}
      <StoriesBar
        stories={stories}
        currentUser={currentUser}
        onStoryClick={onStoryClick}
        onAddStoryClick={onAddStoryClick}
      />

      {/* Inline Quick Composer Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/src/assets/images/feed_portrait_art_1794057469353.jpg';
            }}
          />
          <button
            type="button"
            onClick={onOpenCreatePost}
            className="flex-1 text-left px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs sm:text-sm text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
          >
            What are you creating or thinking about, {currentUser.displayName.split(' ')[0]}?
          </button>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onOpenCreatePost}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Add Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenCreatePost}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Create Poll"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Feed Controls */}
      <div className="sticky top-14 lg:top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            type="button"
            onClick={() => setFeedFilter('for_you')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              feedFilter === 'for_you'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            For You
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter('following')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              feedFilter === 'following'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Following
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter('media')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              feedFilter === 'media'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Visuals
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter('discussions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              feedFilter === 'discussions'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Discussions
          </button>
        </div>

        {/* Active filter badge if active */}
        {(selectedTopic || searchQuery) && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400">
            <span className="font-medium truncate max-w-[140px]">
              {selectedTopic ? `#${selectedTopic}` : `"${searchQuery}"`}
            </span>
            <button
              type="button"
              onClick={() => {
                if (selectedTopic) onClearTopic();
                if (searchQuery) onClearSearch();
              }}
              className="p-1 hover:text-indigo-900 dark:hover:text-indigo-200"
              title="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Posts Stream */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
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
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <p className="text-sm font-semibold">No posts matching your criteria.</p>
            <p className="text-xs">Try selecting a different filter or clearing your search query.</p>
            {(selectedTopic || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  onClearTopic();
                  onClearSearch();
                }}
                className="mt-3 px-4 py-2 text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
