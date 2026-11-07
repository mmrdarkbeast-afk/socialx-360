import React, { useState, useEffect } from 'react';
import { UserProfile, Post, Story, NotificationItem, ChatConversation } from './types';
import {
  INITIAL_CURRENT_USER,
  OTHER_USERS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
} from './data/mockData';
import { Navigation, NavTab } from './components/Navigation';
import { Feed } from './components/Feed';
import { ProfileView } from './components/ProfileView';
import { EditProfileModal } from './components/EditProfileModal';
import { CreatePostModal } from './components/CreatePostModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { SidebarRight } from './components/SidebarRight';
import { NotificationsModal } from './components/NotificationsModal';
import { MessagesDrawer } from './components/MessagesDrawer';
import { ExploreView } from './components/ExploreView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('verve_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('verve_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('verve_theme', 'light');
    }
  }, [isDarkMode]);

  // Current User Profile state with localStorage persistence
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('verve_user_profile');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // fallback to default
      }
    }
    return INITIAL_CURRENT_USER;
  });

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const merged = { ...prev, ...updated };
      try {
        localStorage.setItem('verve_user_profile', JSON.stringify(merged));
      } catch (err) {
        console.error('Failed to save profile to localStorage', err);
      }
      return merged;
    });

    // Update posts authored by current user so avatar and displayName match immediately
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.author.id === currentUser.id) {
          return {
            ...post,
            author: {
              ...post.author,
              ...updated,
            },
          };
        }
        return post;
      })
    );
  };

  // Nav & Active Views
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [storyViewer, setStoryViewer] = useState<{ isOpen: boolean; initialIndex: number }>({
    isOpen: false,
    initialIndex: 0,
  });

  // Data states
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [followingUserIds, setFollowingUserIds] = useState<Set<string>>(
    new Set(['user_elena', 'user_marcus'])
  );

  // Filters & search
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Unread badge calculations
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Post Actions
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isBookmarked = !post.isBookmarked;
          return {
            ...post,
            isBookmarked,
            bookmarksCount: isBookmarked ? post.bookmarksCount + 1 : post.bookmarksCount - 1,
          };
        }
        return post;
      })
    );
  };

  const handleRepostPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isReposted = !post.isReposted;
          return {
            ...post,
            isReposted,
            repostsCount: isReposted ? post.repostsCount + 1 : post.repostsCount - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            author: {
              displayName: currentUser.displayName,
              username: currentUser.username,
              avatarUrl: currentUser.avatarUrl,
            },
            content: text,
            createdAt: 'Just now',
            likesCount: 0,
            isLiked: false,
          };
          return {
            ...post,
            comments: [newComment, ...post.comments],
          };
        }
        return post;
      })
    );
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.poll) {
          if (post.poll.userVotedId === optionId) return post; // already voted for this option

          const updatedOptions = post.poll.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            if (opt.id === post.poll?.userVotedId) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          });

          const totalVotes = updatedOptions.reduce((acc, o) => acc + o.votes, 0);

          return {
            ...post,
            poll: {
              ...post.poll,
              options: updatedOptions,
              userVotedId: optionId,
              totalVotes,
            },
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'isLiked' | 'bookmarksCount' | 'isBookmarked' | 'repostsCount' | 'isReposted' | 'comments'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
      bookmarksCount: 0,
      isBookmarked: false,
      repostsCount: 0,
      isReposted: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setCurrentUser((prev) => ({
      ...prev,
      postsCount: prev.postsCount + 1,
    }));
  };

  // Follow / Unfollow
  const handleToggleFollow = (userId: string) => {
    setFollowingUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  // Chat message send & instant response
  const handleSendMessage = (conversationId: string, text: string) => {
    const myMsg = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: [...c.messages, myMsg],
          };
        }
        return c;
      })
    );

    // Simulated reply after 1.2s for interactive realism
    setTimeout(() => {
      const replyMsg = {
        id: `reply_${Date.now()}`,
        senderId: 'other',
        text: 'Noted! Appreciate the quick update on this.',
        timestamp: 'Just now',
      };
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Story viewed
  const handleStoryViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, hasViewed: true } : s))
    );
  };

  const handleAddStory = () => {
    // Add a fresh story for current user
    const userStory: Story = {
      id: `story_${Date.now()}`,
      author: currentUser,
      mediaUrl: currentUser.coverUrl,
      caption: 'Studio notes from today’s visual edit session.',
      hasViewed: false,
      timestamp: 'Just now',
    };
    setStories([userStory, ...stories]);
    setStoryViewer({ isOpen: true, initialIndex: 0 });
  };

  const handleUserClick = (targetUser: UserProfile) => {
    setViewingUser(targetUser);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'profile') {
      setViewingUser(currentUser);
    } else {
      setViewingUser(null);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const suggestedUsersList = Object.values(OTHER_USERS);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex justify-center transition-colors">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row min-h-screen">
        {/* Left Navigation */}
        <Navigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
          currentUser={currentUser}
          onOpenCreatePost={() => setIsCreatePostOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          unreadNotificationsCount={unreadNotificationsCount}
          unreadMessagesCount={unreadMessagesCount}
        />

        {/* Center Primary Stage */}
        <main className="flex-1 min-w-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-screen pb-20 lg:pb-8 transition-colors">
          {currentTab === 'home' && (
            <Feed
              posts={posts}
              currentUser={currentUser}
              stories={stories}
              selectedTopic={selectedTopic}
              onClearTopic={() => setSelectedTopic(null)}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              onStoryClick={(idx) => setStoryViewer({ isOpen: true, initialIndex: idx })}
              onAddStoryClick={handleAddStory}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              onLikePost={handleLikePost}
              onBookmarkPost={handleBookmarkPost}
              onRepostPost={handleRepostPost}
              onAddComment={handleAddComment}
              onVotePoll={handleVotePoll}
              onUserClick={handleUserClick}
            />
          )}

          {currentTab === 'explore' && (
            <ExploreView
              posts={posts}
              suggestedUsers={suggestedUsersList}
              followingUserIds={followingUserIds}
              onToggleFollow={handleToggleFollow}
              onPostClick={(p) => {
                setSelectedTopic(p.topicTag || null);
                setCurrentTab('home');
              }}
              onUserClick={handleUserClick}
              onSelectTopic={(topic) => {
                setSelectedTopic(topic);
                setCurrentTab('home');
              }}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsDashboard
              posts={posts}
              currentUser={currentUser}
              onSelectTopic={(topic) => {
                setSelectedTopic(topic);
                setCurrentTab('home');
              }}
              onPostClick={(p) => {
                setSelectedTopic(p.topicTag || null);
                setCurrentTab('home');
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationsModal
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
              onNotificationClick={() => {
                setCurrentTab('home');
              }}
            />
          )}

          {currentTab === 'messages' && (
            <MessagesDrawer
              conversations={conversations}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onUserClick={handleUserClick}
            />
          )}

          {currentTab === 'bookmarks' && (
            <div className="w-full">
              <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Saved Bookmarks
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Articles, visual references, and posts you have saved for later
                </p>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {posts.filter((p) => p.isBookmarked).length > 0 ? (
                  posts
                    .filter((p) => p.isBookmarked)
                    .map((post) => (
                      <Feed
                        key={post.id}
                        posts={[post]}
                        currentUser={currentUser}
                        stories={[]}
                        selectedTopic={null}
                        onClearTopic={() => {}}
                        searchQuery=""
                        onClearSearch={() => {}}
                        onStoryClick={() => {}}
                        onAddStoryClick={() => {}}
                        onOpenCreatePost={() => setIsCreatePostOpen(true)}
                        onLikePost={handleLikePost}
                        onBookmarkPost={handleBookmarkPost}
                        onRepostPost={handleRepostPost}
                        onAddComment={handleAddComment}
                        onVotePoll={handleVotePoll}
                        onUserClick={handleUserClick}
                      />
                    ))
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No saved bookmarks</p>
                    <p className="text-xs mt-1">Bookmark posts from the feed to review them here anytime.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentTab === 'profile' && (
            <ProfileView
              user={viewingUser || currentUser}
              currentUser={currentUser}
              posts={posts}
              onEditProfileClick={() => setIsEditProfileOpen(true)}
              onLikePost={handleLikePost}
              onBookmarkPost={handleBookmarkPost}
              onRepostPost={handleRepostPost}
              onAddComment={handleAddComment}
              onVotePoll={handleVotePoll}
              onUserClick={handleUserClick}
              onBackToFeed={() => setCurrentTab('home')}
            />
          )}
        </main>

        {/* Right Sidebar */}
        <SidebarRight
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (currentTab !== 'home') setCurrentTab('home');
          }}
          selectedTopic={selectedTopic}
          onSelectTopic={(topic) => {
            setSelectedTopic(topic);
            if (currentTab !== 'home') setCurrentTab('home');
          }}
          suggestedUsers={suggestedUsersList}
          followingUserIds={followingUserIds}
          onToggleFollow={handleToggleFollow}
          onUserClick={handleUserClick}
          onOpenDashboard={() => setCurrentTab('analytics')}
        />
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={currentUser}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleUpdateProfile}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        currentUser={currentUser}
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onCreatePost={handleCreatePost}
      />

      {/* Story Viewer Modal */}
      <StoryViewerModal
        stories={stories}
        initialIndex={storyViewer.initialIndex}
        isOpen={storyViewer.isOpen}
        onClose={() => setStoryViewer({ isOpen: false, initialIndex: 0 })}
        onStoryViewed={handleStoryViewed}
      />
    </div>
  );
}
