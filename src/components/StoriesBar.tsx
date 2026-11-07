import React from 'react';
import { Plus } from 'lucide-react';
import { Story, UserProfile } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: UserProfile;
  onStoryClick: (index: number) => void;
  onAddStoryClick: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onStoryClick,
  onAddStoryClick,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-3.5 px-4 sm:px-6 transition-colors">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
        {/* Current User Add Story */}
        <button
          type="button"
          onClick={onAddStoryClick}
          className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-slate-500 transition-colors">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/feed_portrait_art_1794057469353.jpg';
                }}
              />
            </div>
            <div className="absolute bottom-0 right-0 p-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full shadow">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[64px]">
            Your story
          </span>
        </button>

        {/* Other stories */}
        {stories.map((story, idx) => {
          return (
            <button
              key={story.id}
              type="button"
              onClick={() => onStoryClick(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div
                className={`w-14 h-14 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                  story.hasViewed
                    ? 'border-2 border-slate-200 dark:border-slate-700'
                    : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-white dark:bg-slate-900">
                  <img
                    src={story.author.avatarUrl}
                    alt={story.author.displayName}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/feed_portrait_art_1794057469353.jpg';
                    }}
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[64px]">
                {story.author.displayName.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
