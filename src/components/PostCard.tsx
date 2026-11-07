import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share,
  CheckCircle2,
  Send,
  X,
  Maximize2,
} from 'lucide-react';
import { Post, UserProfile } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: UserProfile;
  onLike: () => void;
  onBookmark: () => void;
  onRepost: () => void;
  onAddComment: (text: string) => void;
  onVotePoll?: (optionId: string) => void;
  onAuthorClick?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLike,
  onBookmark,
  onRepost,
  onAddComment,
  onVotePoll,
  onAuthorClick,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText('');
  };

  const handleShareClick = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/#${post.id}`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <article className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex items-start gap-3.5">
        {/* Author Avatar */}
        <button
          type="button"
          onClick={onAuthorClick}
          className="shrink-0 w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 group"
        >
          <img
            src={post.author.avatarUrl}
            alt={post.author.displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/src/assets/images/feed_portrait_art_1794057469353.jpg';
            }}
          />
        </button>

        {/* Post Core Content */}
        <div className="flex-1 min-w-0">
          {/* Header Metadata: Clean unboxed text with separators (§1.A Zero-Pill discipline) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={onAuthorClick}
                className="font-semibold text-slate-900 dark:text-slate-100 hover:underline flex items-center gap-1"
              >
                <span>{post.author.displayName}</span>
                {post.author.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900" />
                )}
              </button>
              <span className="font-mono text-slate-400 dark:text-slate-500">@{post.author.username}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span>{post.createdAt}</span>
              {post.topicTag && (
                <>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">{post.topicTag}</span>
                </>
              )}
            </div>
          </div>

          {/* Post Text */}
          <p className="mt-2 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>

          {/* Attached Image / Media (if present) */}
          {post.imageUrl && (
            <div className="mt-3 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-800 group cursor-pointer max-h-[500px]">
              <img
                src={post.imageUrl}
                alt={post.imageAlt || 'Attached visual'}
                className="w-full h-auto object-cover max-h-[500px] group-hover:opacity-95 transition-opacity"
                onClick={() => setLightboxOpen(true)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/profile_banner_landscape_1794057468665.jpg';
                }}
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                title="Expand image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Interactive Poll (if present) */}
          {post.poll && (
            <div className="mt-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {post.poll.question}
              </p>
              <div className="space-y-1.5">
                {post.poll.options.map((opt) => {
                  const percentage =
                    post.poll!.totalVotes > 0
                      ? Math.round((opt.votes / post.poll!.totalVotes) * 100)
                      : 0;
                  const isVoted = post.poll?.userVotedId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onVotePoll && onVotePoll(opt.id)}
                      className={`w-full relative text-left p-2.5 rounded-lg text-xs transition-all overflow-hidden border ${
                        isVoted
                          ? 'border-indigo-600 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-indigo-50 dark:bg-indigo-950/40 pointer-events-none transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex items-center justify-between z-10">
                        <span className="text-slate-800 dark:text-slate-200">{opt.text}</span>
                        <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {percentage}% ({opt.votes})
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                {post.poll.totalVotes} total votes
              </p>
            </div>
          )}

          {/* Actions Bar (§1.D Tabular figures, single line controls) */}
          <div className="mt-3.5 pt-2 flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            {/* Comment */}
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="tabular-nums font-mono">{post.comments.length}</span>
            </button>

            {/* Repost */}
            <button
              type="button"
              onClick={onRepost}
              className={`flex items-center gap-1.5 transition-colors p-1 ${
                post.isReposted
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <Repeat2 className="w-4 h-4" />
              <span className="tabular-nums font-mono">{post.repostsCount}</span>
            </button>

            {/* Like */}
            <button
              type="button"
              onClick={onLike}
              className={`flex items-center gap-1.5 transition-colors p-1 ${
                post.isLiked
                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                  : 'hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  post.isLiked ? 'fill-rose-600 dark:fill-rose-400 scale-110' : ''
                }`}
              />
              <span className="tabular-nums font-mono">{post.likesCount}</span>
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={onBookmark}
              className={`flex items-center gap-1.5 transition-colors p-1 ${
                post.isBookmarked
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              title="Bookmark post"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  post.isBookmarked ? 'fill-indigo-600 dark:fill-indigo-400' : ''
                }`}
              />
              <span className="tabular-nums font-mono">{post.bookmarksCount}</span>
            </button>

            {/* Share */}
            <div className="relative">
              <button
                type="button"
                onClick={handleShareClick}
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-1"
                title="Copy share link"
              >
                <Share className="w-4 h-4" />
              </button>
              {copiedShare && (
                <span className="absolute -top-7 right-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </div>
          </div>

          {/* Expandable Comments Drawer */}
          {showComments && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              {/* Comment submission input */}
              <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a reply..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Comments list */}
              {post.comments.length > 0 ? (
                <div className="space-y-2.5 pt-1">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                      <img
                        src={comment.author.avatarUrl}
                        alt={comment.author.displayName}
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {comment.author.displayName}
                          </span>
                          <span className="text-slate-400">{comment.createdAt}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 text-center py-2">
                  No replies yet. Be the first to start the conversation!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && post.imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={post.imageUrl}
            alt={post.imageAlt || 'Full view'}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </article>
  );
};
