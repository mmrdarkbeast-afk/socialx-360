import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, BarChart2, Plus, Trash2, Send } from 'lucide-react';
import { UserProfile, Post } from '../types';
import { COVER_PHOTO_PRESETS } from '../data/mockData';

interface CreatePostModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (newPostData: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'isLiked' | 'bookmarksCount' | 'isBookmarked' | 'repostsCount' | 'isReposted' | 'comments'>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onCreatePost,
}) => {
  const [content, setContent] = useState('');
  const [topicTag, setTopicTag] = useState('Design Systems');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl) return;

    const pollData =
      showPollCreator && pollQuestion.trim()
        ? {
            question: pollQuestion.trim(),
            options: pollOptions.map((opt, i) => ({
              id: `opt_${Date.now()}_${i}`,
              text: opt.trim() || `Option ${i + 1}`,
              votes: 0,
            })),
            totalVotes: 0,
          }
        : undefined;

    onCreatePost({
      author: currentUser,
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      imageAlt: imageUrl ? 'User attached media' : undefined,
      topicTag: topicTag || undefined,
      poll: pollData,
    });

    setContent('');
    setImageUrl('');
    setShowImageInput(false);
    setShowPollCreator(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-post-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 id="create-post-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Create Post
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {content.length}/500
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {currentUser.displayName}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  @{currentUser.username}
                </span>
              </div>
              <textarea
                autoFocus
                rows={4}
                maxLength={500}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are you building, researching, or observing?"
                className="w-full text-sm bg-transparent border-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 resize-none p-0"
              />
            </div>
          </div>

          {/* Attached Image Preview */}
          {imageUrl && (
            <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-56">
              <img src={imageUrl} alt="Attached preview" className="w-full h-auto object-cover max-h-56" />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Image Input Section */}
          {showImageInput && !imageUrl && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Add Visual Asset</span>
                <button
                  type="button"
                  onClick={() => setShowImageInput(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Upload File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              <div className="pt-1 flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] text-slate-400 shrink-0">Presets:</span>
                {COVER_PHOTO_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className="shrink-0 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 rounded"
                  >
                    {p.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Poll Creator Section */}
          {showPollCreator && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Interactive Community Poll</span>
                <button
                  type="button"
                  onClick={() => setShowPollCreator(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Remove Poll
                </button>
              </div>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
              <div className="space-y-1.5">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                      placeholder={`Choice ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add another option</span>
                </button>
              )}
            </div>
          )}

          {/* Topic selector & Tool triggers */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`p-2 rounded-lg transition-colors ${
                  showImageInput || imageUrl
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Attach image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowPollCreator(!showPollCreator)}
                className={`p-2 rounded-lg transition-colors ${
                  showPollCreator
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Create poll"
              >
                <BarChart2 className="w-4 h-4" />
              </button>

              <select
                value={topicTag}
                onChange={(e) => setTopicTag(e.target.value)}
                className="ml-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="Architecture">Architecture</option>
                <option value="Design Systems">Design Systems</option>
                <option value="Photography">Photography</option>
                <option value="Industrial Design">Industrial Design</option>
                <option value="Visual Arts">Visual Arts</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!content.trim() && !imageUrl}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
