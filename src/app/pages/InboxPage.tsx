import { useState, useMemo, useRef, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Lock, ArrowLeft, ChevronRight, Ghost } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { USERS, Whisper } from '../data/mockData';

function timeAgo(d: string) {
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

interface Conversation {
  otherId: string;
  lastMessage: Whisper;
  unreadCount: number;
  messages: Whisper[];
}

export function InboxPage() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, whispers, sendWhisper, markWhisperRead } = useApp();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeText, setComposeText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom in thread view
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, whispers]);

  // Group whispers into conversations
  const conversations = useMemo((): Conversation[] => {
    if (!currentUser) return [];

    const myWhispers = whispers.filter(
      w => w.fromId === currentUser.id || w.toId === currentUser.id
    );

    const convMap = new Map<string, Conversation>();

    for (const w of myWhispers) {
      const otherId = w.fromId === currentUser.id ? w.toId : w.fromId;
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          otherId,
          lastMessage: w,
          unreadCount: 0,
          messages: [],
        });
      }
      const conv = convMap.get(otherId)!;
      conv.messages.push(w);
      if (!w.read && w.toId === currentUser.id) conv.unreadCount++;
      if (new Date(w.createdAt) > new Date(conv.lastMessage.createdAt)) {
        conv.lastMessage = w;
      }
    }

    return [...convMap.values()].sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
    );
  }, [whispers, currentUser]);

  const activeConv = conversations.find(c => c.otherId === activeConvId);
  const activeMessages = activeConv
    ? [...activeConv.messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : [];
  const otherUser = activeConvId ? USERS.find(u => u.id === activeConvId) : null;

  const handleOpenConv = (otherId: string) => {
    setActiveConvId(otherId);
    // Mark all messages from that person as read
    const conv = conversations.find(c => c.otherId === otherId);
    if (conv) {
      conv.messages.forEach(w => {
        if (!w.read && w.toId === currentUser?.id) markWhisperRead(w.id);
      });
    }
  };

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConvId || !currentUser) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 300));
    sendWhisper(activeConvId, replyText.trim());
    setReplyText('');
    setSending(false);
  };

  const handleCompose = async () => {
    if (!composeTo.trim() || !composeText.trim()) return;
    const target = USERS.find(
      u => u.username === composeTo.trim() || u.email === composeTo.trim()
    );
    if (!target) {
      alert('User not found. Use username or @shiats.edu.in email.');
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 500));
    sendWhisper(target.id, composeText.trim());
    setSending(false);
    setComposeTo('');
    setComposeText('');
    setShowCompose(false);
    setActiveConvId(target.id);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <Lock size={40} className="text-zinc-400 mb-4" />
        <h2
          className="font-black text-xl text-foreground mb-2"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Login to access Whispers
        </h2>
        <p className="text-zinc-500 text-sm font-semibold mb-6">
          Your private messages live here
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
        >
          Login
        </button>
      </div>
    );
  }

  // --- Thread view ---
  if (activeConvId && otherUser) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Thread header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b-2 border-zinc-900 dark:border-zinc-700 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setActiveConvId(null)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => navigate(`/profile/${otherUser.id}`)}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-9 h-9 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shrink-0"
            />
            <div className="min-w-0 text-left">
              <div
                className="font-black text-foreground text-sm truncate"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {otherUser.name}
              </div>
              <div className="text-xs text-zinc-400 font-semibold">@{otherUser.username}</div>
            </div>
            {otherUser.isVerified && (
              <span className="shrink-0 text-[9px] font-black text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-full border border-[#0D9488]/20">
                ✓
              </span>
            )}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeMessages.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 font-semibold text-sm">
              No messages yet. Say hi! 👋
            </div>
          ) : (
            activeMessages.map((msg, i) => {
              const isMine = msg.fromId === currentUser?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isMine
                        ? 'bg-[#7C3AED] text-white rounded-br-md'
                        : 'bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 text-foreground rounded-bl-md shadow-[2px_2px_0px_#18181B] dark:shadow-none'
                    }`}
                  >
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 font-semibold ${
                        isMine ? 'text-white/60 text-right' : 'text-zinc-400'
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply box */}
        <div className="border-t-2 border-zinc-900 dark:border-zinc-700 p-3 bg-background">
          <form onSubmit={handleReply} className="flex items-center gap-2">
            {currentUser && (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shrink-0"
              />
            )}
            <div className="flex-1 relative">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Whisper to ${otherUser.name.split(' ')[0]}...`}
                className="w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-[#7C3AED] transition-all shadow-[2px_2px_0px_#18181B] dark:shadow-none focus:shadow-none"
              />
              <button
                type="submit"
                disabled={!replyText.trim() || sending}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-[#7C3AED] text-white disabled:opacity-40 hover:bg-[#6D28D9] transition-all"
              >
                {sending ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
                ) : (
                  <Send size={14} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- Conversation list view ---
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-black text-2xl text-foreground"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Whispers 💬
          </h1>
          <p className="text-sm text-zinc-500 font-semibold">Private messages</p>
        </div>
        <button
          onClick={() => navigate('/compose-whisper')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-black text-sm border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
        >
          <Send size={16} /> New
        </button>
      </div>

      {/* Compose modal */}
      <AnimatePresence>
        {showCompose && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCompose(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white dark:bg-[#0D0B1A] border-t-2 border-x-2 border-zinc-900 dark:border-zinc-700 rounded-t-3xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between mb-1">
                <h3
                  className="font-black text-foreground"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  New Whisper
                </h3>
                <button
                  onClick={() => setShowCompose(false)}
                  className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <input
                type="text"
                placeholder="To: username or @shiats.edu.in email"
                value={composeTo}
                onChange={e => setComposeTo(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all"
              />
              <textarea
                placeholder="Write your whisper..."
                value={composeText}
                onChange={e => setComposeText(e.target.value)}
                rows={4}
                className="w-full bg-zinc-50 dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all resize-none"
              />
              <button
                onClick={handleCompose}
                disabled={!composeTo.trim() || !composeText.trim() || sending}
                className="w-full py-3 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sending ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={16} /> Send Whisper
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Conversation list */}
      {conversations.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare
            size={40}
            className="text-zinc-300 dark:text-zinc-700 mx-auto mb-3"
          />
          <p
            className="font-black text-foreground"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            No whispers yet
          </p>
          <p className="text-zinc-500 text-sm font-semibold mt-1">
            Send a private message to a SHUATS student
          </p>
          <button
            onClick={() => setShowCompose(true)}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center gap-2"
          >
            <Ghost size={15} /> Start a conversation
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv, i) => {
            const other = USERS.find(u => u.id === conv.otherId);
            if (!other) return null;
            const isMine = conv.lastMessage.fromId === currentUser?.id;

            return (
              <motion.button
                key={conv.otherId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleOpenConv(conv.otherId)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                  conv.unreadCount > 0
                    ? 'border-[#7C3AED] bg-[#7C3AED]/5 shadow-[3px_3px_0px_#7C3AED]'
                    : 'border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[3px_3px_0px_#18181B] dark:shadow-none hover:border-[#7C3AED]/50'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={other.avatar}
                    alt={other.name}
                    className="w-12 h-12 rounded-xl border-2 border-zinc-900 dark:border-zinc-700"
                  />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-[#0D0B1A]">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span
                      className={`text-sm font-black truncate ${
                        conv.unreadCount > 0 ? 'text-foreground' : 'text-foreground'
                      }`}
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {other.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold shrink-0">
                      {timeAgo(conv.lastMessage.createdAt)}
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate font-medium ${
                      conv.unreadCount > 0 ? 'text-foreground font-semibold' : 'text-zinc-500'
                    }`}
                  >
                    {isMine ? 'You: ' : ''}
                    {conv.lastMessage.content}
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="text-zinc-300 dark:text-zinc-600 shrink-0"
                />
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}