import React, { useState } from 'react';
import { Send, CheckCircle2, User, Phone, Video, Search } from 'lucide-react';
import { ChatConversation, UserProfile } from '../types';

interface MessagesDrawerProps {
  conversations: ChatConversation[];
  currentUser: UserProfile;
  onSendMessage: (conversationId: string, text: string) => void;
  onUserClick: (user: UserProfile) => void;
}

export const MessagesDrawer: React.FC<MessagesDrawerProps> = ({
  conversations,
  currentUser,
  onSendMessage,
  onUserClick,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;
    onSendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] lg:h-screen flex flex-col md:flex-row bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Conversations list */}
      <div className="w-full md:w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col shrink-0 h-48 md:h-full overflow-y-auto">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Direct Messages
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
            const lastMsg = conv.messages[conv.messages.length - 1];
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800/80'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <img
                  src={conv.participant.avatarUrl}
                  alt={conv.participant.displayName}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {conv.participant.displayName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {lastMsg?.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {lastMsg ? lastMsg.text : 'Start a conversation'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Stage */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Thread Header */}
          <div className="p-3.5 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={() => onUserClick(activeConversation.participant)}
              className="flex items-center gap-3 text-left group"
            >
              <img
                src={activeConversation.participant.avatarUrl}
                alt={activeConversation.participant.displayName}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:underline">
                    {activeConversation.participant.displayName}
                  </span>
                  {activeConversation.participant.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900" />
                  )}
                </div>
                <span className="text-xs font-mono text-slate-400">
                  @{activeConversation.participant.username}
                </span>
              </div>
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-slate-50/40 dark:bg-slate-950/20">
            {activeConversation.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-br-none shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input box */}
          <form
            onSubmit={handleSend}
            className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeConversation.participant.displayName}...`}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl disabled:opacity-40 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-sm">
          Select a chat to begin messaging
        </div>
      )}
    </div>
  );
};
