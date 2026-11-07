import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import { Story } from '../types';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onStoryViewed: (storyId: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  onStoryViewed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) return;

    onStoryViewed(currentStory.id);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentIndex, isPaused, currentStory, stories.length, onClose, onStoryViewed]);

  if (!isOpen || !currentStory) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySent(true);
    setReplyText('');
    setTimeout(() => setReplySent(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none"
    >
      {/* Top Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev / Next desktop chevron triggers */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Stage Container */}
      <div
        className="relative w-full max-w-sm h-[85vh] max-h-[700px] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Media */}
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.caption}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/profile_banner_landscape_1794057468665.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

        {/* Top Header & Progress bars */}
        <div className="relative z-20 p-3.5 space-y-2.5">
          {/* Progress Indicators */}
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width:
                      idx === currentIndex
                        ? `${progress}%`
                        : idx < currentIndex
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Author bar */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.author.avatarUrl}
                alt={currentStory.author.displayName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/80"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold">{currentStory.author.displayName}</span>
                  {currentStory.author.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400 stroke-black" />
                  )}
                </div>
                <span className="text-[10px] text-white/70">{currentStory.timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Story Caption and Quick Reply Form */}
        <div className="relative z-20 p-4 space-y-3">
          {currentStory.caption && (
            <p className="text-sm text-white font-medium drop-shadow-md leading-relaxed">
              {currentStory.caption}
            </p>
          )}

          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${currentStory.author.displayName}...`}
              className="flex-1 px-3.5 py-2 text-xs bg-black/40 border border-white/20 rounded-full text-white placeholder-white/60 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-white"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2 rounded-full bg-white text-slate-900 disabled:opacity-40 transition-opacity"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {replySent && (
            <p className="text-center text-[11px] text-emerald-400 font-medium">
              Reply sent to direct messages!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
