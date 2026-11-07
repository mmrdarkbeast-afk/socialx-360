export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  location?: string;
  website?: string;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  verified?: boolean;
}

export interface CommentItem {
  id: string;
  author: {
    displayName: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedId?: string;
}

export interface Post {
  id: string;
  author: UserProfile;
  content: string;
  createdAt: string;
  imageUrl?: string;
  imageAlt?: string;
  likesCount: number;
  isLiked: boolean;
  bookmarksCount: number;
  isBookmarked: boolean;
  repostsCount: number;
  isReposted: boolean;
  comments: CommentItem[];
  poll?: PollData;
  topicTag?: string;
}

export interface Story {
  id: string;
  author: UserProfile;
  mediaUrl: string;
  caption: string;
  hasViewed: boolean;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'repost';
  user: {
    displayName: string;
    username: string;
    avatarUrl: string;
  };
  postSnippet?: string;
  createdAt: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  participant: UserProfile;
  messages: ChatMessage[];
  unreadCount: number;
}
